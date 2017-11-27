const { Structures, splitMessage } = require('discord.js');

module.exports = Structures.extend('Message', Message => {
	/**
     * Klasa's Extended Message
     * @extends external:Message
     */
	class KlasaMessage extends Message {

		construtor(...args) {
			super(...args);

			/**
			 * The guild level configs for this context (guild || default)
			 * @since 0.5.0
			 * @type {SettingsGateway}
			 */
			this.guildConfigs = this.guild ? this.guild.configs : this.client.settings.guilds.defaults;

			/**
			 * The previous responses to this message
			 * @since 0.5.0
			 * @type {?KlasaMessage|KlasaMessage[]}
			 */
			this.responses = null;

			/**
			 * The command being run
			 * @since 0.0.1
			 * @type {?Command}
			 */
			this.command = null;

			/**
			 * The prefix used
			 * @since 0.0.1
			 * @type {?RegExp}
			 */
			this.prefix = null;

			/**
			 * The length of the prefix used
			 * @since 0.0.1
			 * @type {?number}
			 */
			this.prefixLength = null;

			/**
			 * The string arguments derived from the usageDelim of the command
			 * @since 0.0.1
			 * @type {string[]}
			 */
			this.args = [];

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
		}

		_patch(data) {
			super._patch(data);

			/**
			 * The language in this setting
			 * @since 0.3.0
			 * @type {Language}
			 */
			this.language = this.guild ? this.guild.language : this.client.config.language;
		}

		_registerCommand({ command, prefix, prefixLength }) {
			this.command = command;
			this.prefix = prefix;
			this.prefixLength = prefixLength;
			this.args = this.command.quotedStringSupport ? this.constructor.getQuotedStringArgs(this) : this.constructor.getArgs(this);
			this.client.emit('commandRun', this, this.command, this.args);
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
			if (this.responses && (!options || !('files' in options))) {
				if (options && options.split) content = splitMessage(content, options.split);
				if (content instanceof Array) {
					const promises = [];
					if (this.responses instanceof Array) {
						for (let i = 0; i < content.length; i++) {
							if (this.responses.length > i) promises.push(this.responses[i].edit(content[i], options));
							else promises.push(this.channel.send(content[i]));
						}
						if (this.responses.length > content.length) {
							for (let i = content.length - 1; i < this.responses.length; i++) this.responses[i].delete();
						}
					} else {
						promises.push(this.responses.edit(content[0], options));
						for (let i = 1; i < content.length; i++) promises.push(this.channel.send(content[i]));
					}
					return Promise.all(promises)
						.then(mes => {
							this.responses = mes;
							return mes;
						});
				} else if (this.responses instanceof Array) {
					for (let i = this.responses.length - 1; i > 0; i--) this.responses[i].delete();
					[this.responses] = this.responses;
				}
				return this.responses.edit(content, options);
			}
			return this.channel.send(content, options)
				.then(mes => {
					if (!options || !('files' in options)) {
						this.responses = mes;
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
					i += msg.command.usageDelim.length - 1;
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

	}

	return KlasaMessage;
});
