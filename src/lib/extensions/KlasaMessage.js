const { Structures } = require('discord.js');
const nick = new RegExp('^<@!');

module.exports = Structures.extend('Message', Message => {
	/**
     * Klasa's Extended Message
     * @extends external:Message
     */
	class KlasaMessage extends Message {

		construtor(...args) {
			super(...args);
			this.guildConfigs = this.guild ? this.guild.configs : this.client.settings.guilds.defaults;
			this.isCommandUser = !this.author.bot || (this.client.user.bot && this.author === this.client.user) || (!this.client.user.bot && this.author !== this.client.user);
			this.responses = [];
		}

		_patch(data) {
			super._patch(data);

			/**
			 * The language in this setting
			 * @since 0.3.0
			 * @type {Language}
			 */
			this.language = this.guild ? this.guild.language : this.client.config.language;

			if (!this.isCommandUser) return;

			const { command, prefix, prefixLength } = this.constructor.parseCommand();

			if (!command) return;

			const validCommand = this.client.commands.get(command);

			if (!validCommand) return;

			/**
			 * The command being run
			 * @since 0.0.1
			 * @type {Command}
			 */
			this.command = validCommand;

			/**
			 * The prefix used
			 * @since 0.0.1
			 * @type {string}
			 */
			this.prefix = prefix;

			/**
			 * The length of the prefix used
			 * @since 0.0.1
			 * @type {number}
			 */
			this.prefixLength = prefixLength;

			/**
			 * The string arguments derived from the usageDelim of the command
			 * @since 0.0.1
			 * @type {string[]}
			 */
			this.args = this.command.quotedStringSupport ? this.constructor.getQuotedStringArgs(this) : this.constructor.getArgs(this);

			/**
			 * The parameters resolved by this class
			 * @since 0.0.1
			 * @type {any[]}
			 */
			this.params = [];

			/**
			 * If the command reprompted for missing args
			 * @since 0.0.1
			 * @type {boolean}
			 */
			this.reprompted = false;

			/**
			 * A cache of the current usage while validating
			 * @since 0.0.1
			 * @private
			 * @type {Object}
			 */
			this._currentUsage = {};

			/**
			 * Whether the current usage is a repeating arg
			 * @since 0.0.1
			 * @private
			 * @type {boolean}
			 */
			this._repeat = false;

			this.client.emit('CommandRun', this);
		}


		get reactable() {
			if (!this.guild) return true;
			return this.channel.readable && this.permissionsFor(this.guild.me).has('ADD_REACTIONS');
		}

		async usableCommands() {
			return this.client.commands.filter(async command => await !this.client.commandInhibitors.some(async inhibitor => {
				if (inhibitor.enabled && !inhibitor.spamProtection) return await inhibitor.run(this.client, this, command).catch(() => true);
				return false;
			}));
		}

		async hasAtLeastPermissionLevel(min) {
			const { permission } = await this.client.permissionLevels.run(this, min);
			return permission;
		}

		sendMessage(content, options) {
			if (!options && typeof content === 'object' && !Array.isArray(content)) {
				options = content;
				content = '';
			} else if (!options) {
				options = {};
			}
			options.embed = options.embed || null;
			if (this.responses.length !== 0 && (!options || !('files' in options))) {
				// todo: multi response editing
				return commandMessage.response.edit(content, options);
			}
			return this.channel.send(content, options)
				.then((mes) => {
					if (!options || !('files' in options)) {
						if (Array.isArray(mes)) this.responses.push(...mes);
						else this.responses.push(mes);
					}
					return mes;
				});
		}

		sendEmbed(embed, content, options) {
			if (!options && typeof content === 'object') {
				options = content;
				content = '';
			} else if (!options) {
				options = {};
			}
			return this.sendMessage(content, Object.assign(options, { embed }));
		}

		sendCode(lang, content, options = {}) {
			return this.sendMessage(content, Object.assign(options, { code: lang }));
		}

		send(content, options) {
			return this.sendMessage(content, options);
		}

		/**
		 * Parses a message into string args
		 * @since 0.0.1
		 * @param {KlasaMessage} msg this message
		 * @private
		 * @returns {string[]}
		 */
		static getArgs(msg) {
			// eslint-disable-next-line newline-per-chained-call
			const args = msg.content.slice(msg.prefixLength).trim().split(' ').slice(1).join(' ').trim().split(msg.command.usageDelim !== '' ? msg.command.usageDelim : undefined);
			return args.length === 1 && args[0] === '' ? [] : args;
		}

		/**
		 * Parses a message into string args taking into account quoted strings
		 * @since 0.0.1
		 * @param {KlasaMessage} msg this message
		 * @private
		 * @returns {string[]}
		 */
		static getQuotedStringArgs(msg) {
			const content = msg.content.slice(msg.prefixLength).trim().split(' ').slice(1).join(' ').trim();

			if (!msg.command.usageDelim || msg.command.usageDelim === '') return [content];

			const args = [];
			let current = '';
			let openQuote = false;

			for (let i = 0; i < content.length; i++) {
				if (!openQuote && content.slice(i, i + msg.command.usageDelim.length) === msg.command.usageDelim) {
					if (current !== '') args.push(current);
					current = '';
					continue;
				}
				if (content[i] === '"' && content[i - 1] !== '\\') {
					openQuote = !openQuote;
					if (current !== '') args.push(current);
					current = '';
					continue;
				}
				current += content[i];
			}
			if (current !== '') args.push(current);

			return args.length === 1 && args[0] === '' ? [] : args;
		}

		static parseCommand(msg) {
			const { regex: prefix, length: prefixLength } = msg.constructor.getPrefix();
			if (!prefix) return { command: false };
			return {
				command: this.content.slice(prefixLength).trim().split(' ')[0].toLowerCase(),
				prefix,
				prefixLength
			};
		}

		static getPrefix(msg) {
			if (msg.client.prefixMention.test(msg.content)) return { length: nick.test(msg.content) ? msg.client.prefixMentionLength + 1 : msg.client.prefixMentionLength, regex: msg.client.prefixMention };
			const prefix = msg.guildConfigs.prefix || msg.client.config.prefix;
			if (prefix instanceof Array) {
				for (let i = prefix.length - 1; i >= 0; i--) {
					const testingPrefix = msg.client.prefixCache.get(prefix[i]) || msg.client.generateNewPrefix(prefix[i]);
					if (testingPrefix.regex.test(msg.content)) return testingPrefix;
				}
			} else if (prefix) {
				const testingPrefix = msg.client.prefixCache.get(prefix) || msg.client.generateNewPrefix(prefix);
				if (testingPrefix.regex.test(msg.content)) return testingPrefix;
			}
			return { regex: false };
		}

	}

	return KlasaMessage;
});
