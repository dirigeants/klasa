const { Monitor, Stopwatch, util: { regExpEsc } } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
		this.ignoreEdits = !this.client.options.commandEditing;
		this.noPrefix = { length: 0, regex: null };
		this.prefixes = new Map();
		this.prefixMention = null;
		this.prefixFlags = this.client.options.prefixCaseInsensitive ? 'i' : '';
	}

	async run(message) {
		if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
		if (!message.channel.postable) return undefined;
		if (message.content === this.client.user.toString() || (message.guild && message.content === message.guild.me.toString())) {
			return message.sendLocale('PREFIX_REMINDER', [message.guildSettings.prefix || undefined]);
		}

		const { commandText, prefix, prefixLength } = this.parseCommand(message);
		if (!commandText) return undefined;

		const command = this.client.commands.get(commandText);
		if (!command) return this.client.emit('commandUnknown', message, commandText);

		const timer = new Stopwatch();
		if (this.client.options.typing) message.channel.startTyping();
		message._registerCommand({ command, prefix, prefixLength });
		try {
			await this.client.inhibitors.run(message, command);
			await this.runCommand(message, timer).catch(err => this.client.emit('error', err));
		} catch (response) {
			this.client.emit('commandInhibited', message, command, response);
		}
		if (this.client.options.typing) message.channel.stopTyping();
		return undefined;
	}

	parseCommand(message) {
		const result = this.getPrefix(message);
		return result ? {
			command: message.content.slice(result.length).trim().split(' ')[0].toLowerCase(),
			prefix: result.regex,
			prefixLength: result.length
		} : { command: false };
	}

	getPrefix(message) {
		const prefixMention = this.prefixMention.exec(message.content);
		if (prefixMention) return { length: prefixMention[0].length, regex: this.prefixMention };

		if (!message.guildSettings.disableNaturalPrefix && this.client.options.regexPrefix) {
			const results = this.client.options.regexPrefix.exec(message.content);
			if (results) return { length: results[0].length, regex: this.client.options.regexPrefix };
		}

		const { prefix } = message.guildSettings;
		if (prefix) {
			for (const prf of Array.isArray(prefix) ? prefix : [prefix]) {
				const testingPrefix = this.prefixes.get(prf) || this.generateNewPrefix(prf);
				if (testingPrefix.regex.test(message.content)) return testingPrefix;
			}
		}

		return this.client.options.noPrefixDM && message.channel.type === 'dm' ? this.noPrefix : false;
	}

	generateNewPrefix(prefix) {
		const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`, this.prefixFlags) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject;
	}

	async runCommand(message, timer) {
		try {
			await message.prompter.run();
			const subcommand = message.command.subcommands ? message.params.shift() : undefined;
			const commandRun = subcommand ? message.command[subcommand](message, message.params) : message.command.run(message, message.params);
			timer.stop();
			const response = await commandRun;
			this.client.finalizers.run(message, response, timer).catch(err => this.client.emit('error', err));
			this.client.emit('commandSuccess', message, message.command, message.params, response);
		} catch (error) {
			this.client.emit('commandError', message, message.command, message.params, error);
		}
	}

	init() {
		this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
	}

};
