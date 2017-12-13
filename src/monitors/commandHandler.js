const { Monitor, Stopwatch, util: { regExpEsc, newError } } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args);
		this.prefixes = new Map();
		this.prefixMention = null;
		this.prefixMentionLength = null;
		this.nick = new RegExp('^<@!');
	}

	async run(msg) {
		if (this.client.user.bot && msg.guild && !msg.guild.me) await msg.guild.members.fetch(this.client.user);
		if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;
		if (msg.content === this.client.user.toString() || (msg.guild && msg.content === msg.guild.me.toString())) {
			msg.sendMessage(Array.isArray(msg.guildConfigs.prefix) ? msg.guildConfigs.prefix.map(prefix => `\`${prefix}\``).join(', ') : `\`${msg.guildConfigs.prefix}\``);
			return;
		}
		const { command, prefix, prefixLength } = this.parseCommand(msg);
		if (!command) return;
		const validCommand = this.client.commands.get(command);
		if (!validCommand) {
			if (this.client.listenerCount('commandUnknown')) this.client.emit('commandUnknown', msg, command);
			return;
		}
		const timer = new Stopwatch();
		if (this.client.options.typing) msg.channel.startTyping();
		msg._registerCommand({ command: validCommand, prefix, prefixLength });
		this.client.inhibitors.run(msg, validCommand)
			.then(() => this.runCommand(msg, timer))
			.catch((response) => {
				if (this.client.options.typing) msg.channel.stopTyping();
				this.client.emit('commandInhibited', msg, validCommand, response);
			});
	}

	parseCommand(msg) {
		const { regex: prefix, length: prefixLength } = this.getPrefix(msg);
		if (!prefix) return { command: false };
		return {
			command: msg.content.slice(prefixLength).trim().split(' ')[0].toLowerCase(),
			prefix,
			prefixLength
		};
	}

	getPrefix(msg) {
		if (this.prefixMention.test(msg.content)) return { length: this.nick.test(msg.content) ? this.prefixMentionLength + 1 : this.prefixMentionLength, regex: this.prefixMention };
		if (msg.guildConfigs.disableNaturalPrefix !== true && this.client.options.regexPrefix) {
			const results = this.client.options.regexPrefix.exec(msg.content);
			if (results) return { length: results[0].length, regex: this.client.options.regexPrefix };
		}
		const prefix = msg.guildConfigs.prefix || this.client.options.prefix;
		if (Array.isArray(prefix)) {
			for (let i = prefix.length - 1; i >= 0; i--) {
				const testingPrefix = this.prefixes.get(prefix[i]) || this.generateNewPrefix(prefix[i]);
				if (testingPrefix.regex.test(msg.content)) return testingPrefix;
			}
		} else if (prefix) {
			const testingPrefix = this.prefixes.get(prefix) || this.generateNewPrefix(prefix);
			if (testingPrefix.regex.test(msg.content)) return testingPrefix;
		}
		return false;
	}

	generateNewPrefix(prefix) {
		const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject;
	}

	async runCommand(msg, timer) {
		try {
			await msg.validateArgs();
		} catch (error) {
			if (this.client.options.typing) msg.channel.stopTyping();
			if (error.code === 1 && this.client.options.cmdPrompt) {
				return this.awaitMessage(msg, timer, error.message)
					.catch(err => this.client.emit('commandError', msg, msg.command, msg.params, err));
			}
			return this.client.emit('commandError', msg, msg.command, msg.params, error);
		}

		const commandRun = msg.command.run(msg, msg.params);

		if (this.client.options.typing) msg.channel.stopTyping();
		timer.stop();

		return commandRun
			.then(mes => {
				this.client.finalizers.run(msg, mes, timer);
				this.client.emit('commandSuccess', msg, msg.command, msg.params, mes);
			})
			.catch(error => this.client.emit('commandError', msg, msg.command, msg.params, error));
	}

	async awaitMessage(msg, timer, error) {
		const message = await msg.channel.send(msg.language.get('MONITOR_COMMAND_HANDLER_REPROMPT', `<@!${msg.author.id}>`, error, this.client.options.promptTime / 1000))
			.catch((err) => { throw newError(err); });

		const param = await msg.channel.awaitMessages(response => response.author.id === msg.author.id && response.id !== message.id, { max: 1, time: this.client.options.promptTime, errors: ['time'] })
			.catch(() => {
				message.delete();
				throw undefined;
			});

		if (param.first().content.toLowerCase() === 'abort') throw msg.language.get('MONITOR_COMMAND_HANDLER_ABORTED');
		msg.args[msg.args.lastIndexOf(null)] = param.first().content;
		msg.reprompted = true;

		message.delete();
		if (this.client.options.typing) msg.channel.startTyping();
		return this.runCommand(msg, timer);
	}

	init() {
		this.ignoreSelf = this.client.user.bot;
		this.ignoreOthers = !this.client.user.bot;
		this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
		this.prefixMentionLength = this.client.user.id.length + 3;
	}

};
