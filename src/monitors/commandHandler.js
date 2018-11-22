const { Monitor, Stopwatch, util: { regExpEsc } } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
		this.ignoreEdits = !this.client.options.commandEditing;
		this.prefixes = new Map();
		this.prefixMention = null;
		this.mentionOnly = null;
		this.prefixFlags = this.client.options.prefixCaseInsensitive ? 'i' : '';
	}

	async run(message) {
		if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
		if (!message.channel.postable) return undefined;
		if (this.mentionOnly.test(message.content)) return message.sendLocale('PREFIX_REMINDER', [message.guildSettings.prefix.length ? message.guildSettings.prefix : undefined]);

		const { commandText, prefix, prefixLength } = this.parseCommand(message);
		if (!commandText) return undefined;

		const command = this.client.commands.get(commandText);
		if (!command) return this.client.emit('commandUnknown', message, commandText, prefix, prefixLength);

		return this.runCommand(message._registerCommand({ command, prefix, prefixLength }));
	}

	parseCommand(message) {
		const result = this.customPrefix(message) || this.mentionPrefix(message) || this.naturalPrefix(message) || this.prefixLess(message);
		return result ? {
			commandText: message.content.slice(result.length).trim().split(' ')[0].toLowerCase(),
			prefix: result.regex,
			prefixLength: result.length
		} : { commandText: false };
	}

	customPrefix({ content, guildSettings: { prefix } }) {
		if (!prefix) return null;
		for (const prf of Array.isArray(prefix) ? prefix : [prefix]) {
			const testingPrefix = this.prefixes.get(prf) || this.generateNewPrefix(prf);
			if (testingPrefix.regex.test(content)) return testingPrefix;
		}
		return null;
	}

	mentionPrefix({ content }) {
		const prefixMention = this.prefixMention.exec(content);
		return prefixMention ? { length: prefixMention[0].length, regex: this.prefixMention } : null;
	}

	naturalPrefix({ content, guildSettings: { disableNaturalPrefix } }) {
		if (disableNaturalPrefix || !this.client.options.regexPrefix) return null;
		const results = this.client.options.regexPrefix.exec(content);
		return results ? { length: results[0].length, regex: this.client.options.regexPrefix } : null;
	}

	prefixLess({ channel: { type } }) {
		return this.client.options.noPrefixDM && type === 'dm' ? { length: 0, regex: null } : null;
	}

	generateNewPrefix(prefix) {
		const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`, this.prefixFlags) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject;
	}

	async runCommand(message) {
		const timer = new Stopwatch();
		if (this.client.options.typing) message.channel.startTyping();
		try {
			await this.client.inhibitors.run(message, message.command);
			try {
				await message.prompter.run();
				const subcommand = message.command.subcommands ? message.params.shift() : undefined;
				const commandRun = subcommand ? message.command[subcommand](message, message.params) : message.command.run(message, message.params);
				timer.stop();
				const response = await commandRun;
				this.client.finalizers.run(message, message.command, response, timer);
				this.client.emit('commandSuccess', message, message.command, message.params, response);
			} catch (error) {
				this.client.emit('commandError', message, message.command, message.params, error);
			}
		} catch (response) {
			this.client.emit('commandInhibited', message, message.command, response);
		}
		if (this.client.options.typing) message.channel.stopTyping();
	}

	init() {
		this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
		this.mentionOnly = new RegExp(`^<@!?${this.client.user.id}>$`);
	}

};
