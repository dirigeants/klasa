const { Structures, splitMessage, Collection } = require('discord.js');
const { isObject } = require('../util/util');

module.exports = Structures.extend('Message', Message => {
	/**
	 * Klasa's Extended Message
	 * @extends external:Message
	 */
	class KlasaMessage extends Message {

		/**
		 * Data that can be resolved to give a string. This can be:
		 * * A string
		 * * An array (joined with a new line delimiter to give a string)
		 * * Any value
		 * @typedef {string|Array|*} StringResolvable
		 * @memberof KlasaMessage
		 */

		/**
		 * Options provided when sending or editing a message.
		 * @typedef {Object} MessageOptions
		 * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
		 * @property {string} [nonce=''] The nonce for the message
		 * @property {RichEmbed|Object} [embed] An embed for the message
		 * (see [here]{@link https://discordapp.com/developers/docs/resources/channel#embed-object} for more details)
		 * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
		 * should be replaced with plain-text
		 * @property {FileOptions|BufferResolvable|Attachment} [file] A file to send with the message **(deprecated)**
		 * @property {FileOptions[]|BufferResolvable[]|Attachment[]} [files] Files to send with the message
		 * @property {string|boolean} [code] Language for optional codeblock formatting to apply
		 * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
		 * it exceeds the character limit. If an object is provided, these are the options for splitting the message
		 * @property {UserResolvable} [reply] User to reply to (prefixes the message with a mention, except in DMs)
		 * @memberof KlasaMessage
		 */

		/**
		 * @param {...*} args Normal D.JS Message args
		 */
		constructor(...args) {
			super(...args);

			/**
			 * The guild level configs for this context (guild || default)
			 * @since 0.5.0
			 * @type {Configuration}
			 */
			this.guildConfigs = this.guild ? this.guild.configs : this.client.gateways.guilds.defaults;

			/**
			 * The previous responses to this message
			 * @since 0.5.0
			 * @type {?(KlasaMessage|KlasaMessage[])}
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
			 * A command prompt/argument handler
			 * @since 0.5.0
			 * @type {CommandPrompt}
			 * @private
			 */
			this.prompter = null;
		}

		/**
		 * The string arguments derived from the usageDelim of the command
		 * @since 0.0.1
		 * @type {string[]}
		 * @readonly
		 */
		get args() {
			return this.prompter ? this.prompter.args : [];
		}

		/**
		 * The parameters resolved by this class
		 * @since 0.0.1
		 * @type {any[]}
		 * @readonly
		 */
		get params() {
			return this.prompter ? this.prompter.params : [];
		}

		/**
		 * The flags resolved by this class
		 * @since 0.5.0
		 * @type {Object}
		 * @readonly
		 */
		get flags() {
			return this.prompter ? this.prompter.flags : {};
		}

		/**
		 * If the command reprompted for missing args
		 * @since 0.0.1
		 * @type {boolean}
		 * @readonly
		 */
		get reprompted() {
			return this.prompter ? this.prompter.reprompted : false;
		}

		/**
		 * If this message can be reacted to by the bot
		 * @since 0.0.1
		 * @type {boolean}
		 * @readonly
		 */
		get reactable() {
			if (!this.guild) return true;
			return this.channel.readable && this.permissionsFor(this.guild.me).has('ADD_REACTIONS');
		}

		/**
		 * Awaits a response from the author.
		 * @param {string} text The text to prompt the author
		 * @param {number} [time=30000] The time to wait before giving up
		 * @returns {Promise<KlasaMessage>}
		 */
		async prompt(text, time = 30000) {
			const message = await this.channel.send(text);
			const responses = await this.channel.awaitMessages(mes => mes.author === this.author, { time, max: 1 });
			message.delete();
			if (responses.size === 0) throw undefined;
			return responses.first();
		}

		/**
		 * The usable commands by the author in this message's context
		 * @since 0.0.1
		 * @returns {Promise<Collection>} The filtered CommandStore
		 */
		async usableCommands() {
			const col = new Collection();
			await Promise.all(this.client.commands.map((command) =>
				this.client.inhibitors.run(this, command, true)
					.then(() => { col.set(command.name, command); })
					.catch(() => {
						// noop
					})
			));
			return col;
		}

		/**
		 * Checks if the author of this message, has applicable permission in this message's context of at least min
		 * @since 0.0.1
		 * @param {number} min The minimum level required
		 * @returns {Promise<boolean>}
		 */
		async hasAtLeastPermissionLevel(min) {
			const { permission } = await this.client.permissionLevels.run(this, min);
			return permission;
		}

		/**
		 * Sends a message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {StringResolvable} [content] The content to send
		 * @param {MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendMessage(content, options) {
			options = this.constructor.combineContentOptions(content, options);
			content = options.content; // eslint-disable-line prefer-destructuring
			delete options.content;
			if (Array.isArray(content)) content = content.join('\n');

			options.embed = options.embed || null;
			if (this.responses && typeof options.files === 'undefined') {
				if (options && options.split) content = splitMessage(content, options.split);
				if (Array.isArray(content)) {
					const promises = [];
					if (Array.isArray(this.responses)) {
						/* eslint-disable max-depth */
						for (let i = 0; i < content.length; i++) {
							if (this.responses.length > i) promises.push(this.responses[i].edit(content[i], options));
							else promises.push(this.channel.send(content[i]));
						}
						if (this.responses.length > content.length) {
							for (let i = content.length; i < this.responses.length; i++) this.responses[i].delete();
						}
						/* eslint-enable max-depth */
					} else {
						promises.push(this.responses.edit(content[0], options));
						for (let i = 1; i < content.length; i++) promises.push(this.channel.send(content[i]));
					}
					return Promise.all(promises)
						.then(mes => {
							this.responses = mes;
							return mes;
						});
				} else if (Array.isArray(this.responses)) {
					for (let i = this.responses.length - 1; i > 0; i--) this.responses[i].delete();
					[this.responses] = this.responses;
				}
				return this.responses.edit(content, options);
			}
			return this.channel.send(content, options)
				.then(mes => {
					if (typeof options.files === 'undefined') this.responses = mes;
					return mes;
				});
		}

		/**
		 * Sends an embed message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {external:MessageEmbed} embed The embed to post
		 * @param {StringResolvable} [content] The content to send
		 * @param {MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendEmbed(embed, content, options) {
			return this.sendMessage(Object.assign(this.constructor.combineContentOptions(content, options), { embed }));
		}

		/**
		 * Sends a codeblock message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {string} lang The language of the codeblock
		 * @param {StringResolvable} content The content to send
		 * @param {MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendCode(lang, content, options) {
			return this.sendMessage(Object.assign(this.constructor.combineContentOptions(content, options), { code: lang }));
		}

		/**
		 * Sends a message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {StringResolvable} [content] The content to send
		 * @param {MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		send(content, options) {
			return this.sendMessage(content, options);
		}

		/**
		 * Extends the patch method from D.JS to attach and update the language to this instance
		 * @since 0.5.0
		 * @param {*} data The data passed from the original constructor
		 * @private
		 */
		_patch(data) {
			super._patch(data);

			/**
			 * The language in this setting
			 * @since 0.3.0
			 * @type {Language}
			 */
			this.language = this.guild ? this.guild.language : this.client.languages.default;
		}

		/**
		 * Register's this message as a Command Message
		 * @since 0.5.0
		 * @param {Object} commandInfo The info about the command and prefix used
		 * @property {Command} command The command run
		 * @property {RegExp} prefix The prefix used
		 * @property {number} prefixLength The length of the prefix used
		 * @private
		 */
		_registerCommand({ command, prefix, prefixLength }) {
			this.command = command;
			this.prefix = prefix;
			this.prefixLength = prefixLength;
			this.prompter = this.command.usage.createPrompt(this, {
				quotedStringSupport: this.command.quotedStringSupport,
				promptTime: this.command.promptTime,
				promptLimit: this.command.promptLimit
			});
			this.client.emit('commandRun', this, this.command, this.args);
		}

		/**
		 * Merge the content with the options.
		 * @since 0.5.0
		 * @param {StringResolvable} [content] The content to send
		 * @param {MessageOptions} [options] The D.JS message options
		 * @returns {MessageOptions}
		 * @private
		 */
		static combineContentOptions(content, options) {
			if (!options) return isObject(content) ? content : { content };
			return Object.assign(options, { content });
		}

	}

	return KlasaMessage;
});
