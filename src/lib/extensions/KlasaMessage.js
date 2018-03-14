const { Structures, splitMessage, Collection, MessageAttachment, MessageEmbed } = require('discord.js');
const { isObject } = require('../util/util');

module.exports = Structures.extend('Message', Message => {
	/**
	 * Klasa's Extended Message
	 * @extends external:Message
	 */
	class KlasaMessage extends Message {

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

			/**
			 * The ids of the responses to this message
			 * @since 0.5.0
			 * @type {external:Snowflake[]}
			 * @private
			 */
			this._responses = [];
		}

		/**
		 * The previous responses to this message
		 * @since 0.5.0
		 * @type {KlasaMessage[]}
		 * @readonly
		 */
		get responses() {
			const responses = [];
			for (const id of this._responses) {
				const response = this.channel.messages.get(id);
				if (response) responses.push(response);
			}
			return responses;
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
		 * @returns {KlasaMessage}
		 */
		async prompt(text, time = 30000) {
			const message = await this.channel.send(text);
			const responses = await this.channel.awaitMessages(mes => mes.author === this.author, { time, max: 1 });
			message.delete();
			if (responses.size === 0) throw this.language.get('MESSAGE_PROMPT_TIMEOUT');
			return responses.first();
		}

		/**
		 * The usable commands by the author in this message's context
		 * @since 0.0.1
		 * @returns {Collection<string, Command>} The filtered CommandStore
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
		 * @returns {boolean}
		 */
		async hasAtLeastPermissionLevel(min) {
			const { permission } = await this.client.permissionLevels.run(this, min);
			return permission;
		}

		/**
		 * Sends a message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {external:StringResolvable|external:MessageEmbed|external:MessageAttachment} [content] The content to send
		 * @param {external:MessageOptions} [options] The D.JS message options
		 * @returns {KlasaMessage|KlasaMessage[]}
		 */
		async sendMessage(content, options) {
			// eslint-disable-next-line prefer-const
			let { content: _content, ..._options } = this.constructor.handleOptions(content, options);

			if (typeof _options.files !== 'undefined') return this.channel.send(_content, _options);
			if (Array.isArray(_content)) _content = _content.join('\n');
			if (_options && _options.split) _content = splitMessage(_content, _options.split);
			if (!Array.isArray(_content)) _content = [_content];

			const { responses } = this;
			const promises = [];
			const max = Math.max(_content.length, responses.length);

			for (let i = 0; i < max; i++) {
				if (i >= _content.length) responses[i].delete();
				else if (responses.length > i) promises.push(responses[i].edit(_content[i], _options));
				else promises.push(this.channel.send(_content[i], _options));
			}

			const newResponses = await Promise.all(promises);
			this._responses = newResponses.map(res => res.id);
			return newResponses.length === 1 ? newResponses[0] : newResponses;
		}

		/**
		 * Sends an embed message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {external:MessageEmbed} embed The embed to post
		 * @param {external:StringResolvable} [content] The content to send
		 * @param {external:MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendEmbed(embed, content, options) {
			return this.sendMessage({ ...this.constructor.combineContentOptions(content, options), embed });
		}

		/**
		 * Sends a codeblock message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {string} lang The language of the codeblock
		 * @param {external:StringResolvable} content The content to send
		 * @param {external:MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendCode(lang, content, options) {
			return this.sendMessage({ ...this.constructor.combineContentOptions(content, options), code: lang });
		}

		/**
		 * Sends a message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {external:StringResolvable|external:MessageEmbed|external:MessageAttachment} [content] The content to send
		 * @param {external:MessageOptions} [options] The D.JS message options
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
		 * @param {external:StringResolvable} [content] The content to send
		 * @param {external:MessageOptions} [options] The D.JS message options
		 * @returns {external:MessageOptions}
		 * @private
		 */
		static combineContentOptions(content, options) {
			if (!options) return isObject(content) ? content : { content };
			return { ...options, content };
		}

		/**
		 * Handle all send overloads.
		 * @since 0.5.0
		 * @param {external:StringResolvable|external:MessageEmbed|external:MessageAttachment} [content] The content to send
		 * @param {external:MessageOptions} [options={}] The D.JS message options
		 * @returns {external:MessageOptions}
		 * @private
		 */
		static handleOptions(content, options = {}) {
			if (content instanceof MessageEmbed) options.embed = content;
			else if (content instanceof MessageAttachment) options.files = [content];
			else if (isObject(content)) options = content;
			else options = this.combineContentOptions(content, options);

			if (options.split && typeof options.code !== 'undefined' && (typeof options.code !== 'boolean' || options.code === true)) {
				if (typeof options.split === 'boolean') options.split = {};
				options.split.prepend = `\`\`\`${typeof options.code !== 'boolean' ? options.code || '' : ''}\n`;
				options.split.append = '\n```';
			}

			options.embed = options.embed || null;
			options.content = options.content || null;
			return options;
		}

	}

	return KlasaMessage;
});
