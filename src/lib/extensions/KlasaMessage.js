const { Structures, Collection, APIMessage, Permissions: { FLAGS } } = require('discord.js');

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
			 * The guild level settings for this context (guild || default)
			 * @since 0.5.0
			 * @type {Settings}
			 */
			this.guildSettings = this.guild ? this.guild.settings : this.client.gateways.guilds.defaults;

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
			 * The responses to this message
			 * @since 0.5.0
			 * @type {external:KlasaMessage[]}
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
			return this._responses.filter(msg => !msg.deleted);
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
			return this.channel.readable && this.channel.permissionsFor(this.guild.me).has(FLAGS.ADD_REACTIONS, false);
		}

		/**
		 * Gets the level id of this message (with respect to @{link Command#cooldownLevel})
		 * @since 0.5.0
		 * @type {?string}
		 * @readonly
		 * @private
		 */
		get levelID() {
			if (!this.command) return null;
			return this.guild ? this[this.command.cooldownLevel].id : this.author.id;
		}

		/**
		 * Awaits a response from the author.
		 * @param {string} text The text to prompt the author
		 * @param {number} [time=30000] The time to wait before giving up
		 * @returns {KlasaMessage}
		 */
		async prompt(text, time = 30000) {
			const message = await this.channel.send(text);
			const responses = await this.channel.awaitMessages(msg => msg.author === this.author, { time, max: 1 });
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
			const combinedOptions = APIMessage.transformOptions(content, options);

			if ('files' in combinedOptions) return this.channel.send(combinedOptions);

			const newMessages = new APIMessage(this.channel, combinedOptions).resolveData().split()
				.map(mes => {
					// Command editing should always remove embeds and content if none is provided
					mes.data.embed = mes.data.embed || null;
					mes.data.content = mes.data.content || null;
					return mes;
				});

			const { responses } = this;
			const promises = [];
			const max = Math.max(newMessages.length, responses.length);

			for (let i = 0; i < max; i++) {
				if (i >= newMessages.length) responses[i].delete();
				else if (responses.length > i) promises.push(responses[i].edit(newMessages[i]));
				else promises.push(this.channel.send(newMessages[i]));
			}

			const newResponses = await Promise.all(promises);

			// Can't store the clones because deleted will never be true
			this._responses = newMessages.map((val, i) => responses[i] || newResponses[i]);

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
			return this.sendMessage(APIMessage.transformOptions(content, options, { embed }));
		}

		/**
		 * Sends a codeblock message that will be editable via command editing (if nothing is attached)
		 * @since 0.0.1
		 * @param {string} code The language of the codeblock
		 * @param {external:StringResolvable} content The content to send
		 * @param {external:MessageOptions} [options] The D.JS message options
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendCode(code, content, options) {
			return this.sendMessage(APIMessage.transformOptions(content, options, { code }));
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
		 * Sends a message that will be editable via command editing (if nothing is attached)
		 * @since 0.5.0
		 * @param {string} key The Language key to send
		 * @param {Array<*>} [localeArgs] The language arguments to pass
		 * @param {external:MessageOptions} [options] The D.JS message options plus Language arguments
		 * @returns {Promise<KlasaMessage|KlasaMessage[]>}
		 */
		sendLocale(key, localeArgs = [], options = {}) {
			if (!Array.isArray(localeArgs)) [options, localeArgs] = [localeArgs, []];
			return this.sendMessage(APIMessage.transformOptions(this.language.get(key, ...localeArgs), undefined, options));
		}

		/**
		 * Since d.js is dumb and has 2 patch methods, this is for edits
		 * @since 0.5.0
		 * @param {*} data The data passed from the original constructor
		 * @private
		 */
		patch(data) {
			super.patch(data);
			this.language = this.guild ? this.guild.language : this.client.languages.default;
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
		 * @returns {this}
		 * @private
		 */
		_registerCommand({ command, prefix, prefixLength }) {
			this.command = command;
			this.prefix = prefix;
			this.prefixLength = prefixLength;
			this.prompter = this.command.usage.createPrompt(this, {
				quotedStringSupport: this.command.quotedStringSupport,
				time: this.command.promptTime,
				limit: this.command.promptLimit
			});
			this.client.emit('commandRun', this, this.command, this.args);
			return this;
		}

	}

	return KlasaMessage;
});
