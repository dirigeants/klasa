const { Monitor, CommandMessage, Stopwatch, util: { regExpEsc, newError } } = require('klasa');

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
		const { command, prefix, prefixLength } = this.parseCommand(msg);
		if (!command) return;
		const validCommand = this.client.commands.get(command);
		if (!validCommand) {
			if (this.client.listenerCount('commandUnknown')) this.client.emit('commandUnknown', msg, command);
			return;
		}
		const timer = new Stopwatch();
		if (this.client.config.typing) msg.channel.startTyping();

		this.client.inhibitors.run(msg, validCommand)
			.then(() => this.runCommand(this.makeProxy(msg, new CommandMessage(msg, validCommand, prefix, prefixLength)), timer))
			.catch((response) => {
				if (this.client.config.typing) msg.channel.stopTyping();
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
		const prefix = msg.guildSettings.prefix || this.client.config.prefix;
		if (prefix instanceof Array) {
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

	makeProxy(msg, cmdMsg) {
		return new Proxy(msg, {
			get: function handler(target, param) {
				return param in msg ? msg[param] : cmdMsg[param];
			}
		});
	}

	async runCommand(msg, timer) {
		try {
			await msg.validateArgs();
		} catch (error) {
			if (this.client.config.typing) msg.channel.stopTyping();
			if (error.code === 1 && this.client.config.cmdPrompt) {
				return this.awaitMessage(msg, timer, error.message)
					.catch(err => this.client.emit('commandError', msg, msg.cmd, msg.params, err));
			}
			return this.client.emit('commandError', msg, msg.cmd, msg.params, error);
		}

		const commandRun = msg.cmd.run(msg, msg.params);

		if (this.client.config.typing) msg.channel.stopTyping();
		timer.stop();

		return commandRun
			.then(mes => {
				this.client.finalizers.run(msg, mes, timer);
				this.client.emit('commandRun', msg, msg.cmd, msg.params, mes);
			})
			.catch(error => this.client.emit('commandError', msg, msg.cmd, msg.params, error));
	}

	async awaitMessage(msg, timer, error) {
		const message = await msg.channel.send(msg.language.get('MONITOR_COMMAND_HANDLER_REPROMPT', `<@!${msg.author.id}>`, error, this.client.config.promptTime / 1000))
			.catch((err) => { throw newError(err); });

		const param = await msg.channel.awaitMessages(response => response.author.id === msg.author.id && response.id !== message.id, { max: 1, time: this.client.config.promptTime, errors: ['time'] })
			.catch(() => {
				message.delete();
				throw undefined;
			});

		if (param.first().content.toLowerCase() === 'abort') throw msg.language.get('MONITOR_COMMAND_HANDLER_ABORTED');
		msg.args[msg.args.lastIndexOf(null)] = param.first().content;
		msg.reprompted = true;

		message.delete();
		if (this.client.config.typing) msg.channel.startTyping();
		return this.runCommand(msg, timer);
	}

	init() {
		this.ignoreSelf = this.client.user.bot;
		this.ignoreOthers = !this.client.user.bot;
		this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
		this.prefixMentionLength = this.client.user.id.length + 3;
	}

};
