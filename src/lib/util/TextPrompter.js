const ParsedUsage = require('../usage/ParsedUsage');

class TextPrompter {

	constructor(msg, usage, options) {
		this.client = msg.client;
		this.message = msg;
		this.parsedUsage = usage instanceof ParsedUsage ? usage.parsedUsage : ParsedUsage.parseUsage(usage);
		this.options = options;

		this.promptTime = options.promptTime || this.client.options.promptTime;
		this.promptLimit = options.promptLimit || this.client.options.promptLimit;
		this.typing = msg.command ? this.client.options.typing : false;

		/**
		 * If the command reprompted for missing args
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.reprompted = false;

		let flags, content, args;
		if (this.message.command) {
			({ content, flags } = this.constructor.getFlags(this.message.content, this.message.command.usageDelim, this.message.prefixLength));
			args = options.quotedStringSupport ?
				this.constructor.getQuotedStringArgs(content, this.message.command.usageDelim) :
				this.constructor.getArgs(content, this.message.command.usageDelim);
		}

		/**
		 * The flag arguments resolved by this class
		 * @since 0.5.0
		 * @type {Object}
		 */
		this.flags = flags || {};

		/**
		 * The string arguments derived from the usageDelim of the command
		 * @since 0.0.1
		 * @type {string[]}
		 */
		this.args = args || [];

		/**
		 * The parameters resolved by this class
		 * @since 0.0.1
		 * @type {any[]}
		 */
		this.params = [];


		/**
		 * Whether the current usage is a repeating arg
		 * @since 0.0.1
		 * @type {boolean}
		 * @private
		 */
		this._repeat = false;

		/**
		 * Whether the current usage is a repeating arg
		 * @since 0.0.1
		 * @type {boolean}
		 * @private
		 */
		this._prompted = 0;

		this._currentUsage = null;
	}

	async reprompt(prompt) {
		this._prompted++;
		if (this.typing) this.message.channel.stopTyping();
		const message = await this.message.prompt(
			this.message.language.get('MONITOR_COMMAND_HANDLER_REPROMPT', `<@!${this.message.author.id}>`, prompt, this.client.options.promptTime / 1000),
			this.client.options.promptTime
		);

		if (message.content.toLowerCase() === 'abort') throw this.message.language.get('MONITOR_COMMAND_HANDLER_ABORTED');

		if (this.typing) this.message.channel.startTyping();
		this.args[this.message.args.lastIndexOf(null)] = message.content;
		this.reprompted = true;

		return this.validateArgs();
	}

	/**
	 * Validates and resolves args into parameters
	 * @since 0.0.1
	 * @returns {Promise<any[]>} The resolved parameters
	 * @private
	 */
	async validateArgs() {
		if (this.params.length >= this.parsedUsage.length && this.params.length >= this.args.length) {
			return this.params;
		} else if (this.parsedUsage[this.params.length]) {
			if (this.parsedUsage[this.params.length].type !== 'repeat') {
				this._currentUsage = this.parsedUsage[this.params.length];
			} else if (this.parsedUsage[this.params.length].type === 'repeat') {
				this._currentUsage.type = 'optional';
				this._repeat = true;
			}
		} else if (!this._repeat) {
			return this.params;
		}

		if (this._currentUsage.possibles.length !== 1) return this.multiPossibles(0);

		if (this._currentUsage.possibles[0].name in this.flags) this.args.splice(this.params.length, 0, this.flags[this._currentUsage.possibles[0].name]);

		if (!this.client.argResolver[this._currentUsage.possibles[0].type]) {
			this.client.emit('warn', 'Unknown Argument Type encountered');
			return this.pushParam(undefined);
		}

		try {
			const res = await this.client.argResolver[this._currentUsage.possibles[0].type](this.args[this.params.length], this._currentUsage, 0, this._repeat, this);
			if (res !== null) return this.pushParam(res);
			this.args.splice(this.params.length, 0, undefined);
			return this.pushParam(undefined);
		} catch (err) {
			if (this._currentUsage.type === 'optional') {
				this.args.splice(this.params.length, 0, undefined);
				return this.pushParam(undefined);
			}
			return this.handleError(err);
		}
	}

	/**
	 * Validates and resolves args into parameters, when multiple types of usage is defined
	 * @since 0.0.1
	 * @param {number} possible The id of the possible usage currently being checked
	 * @returns {Promise<any[]>} The resolved parameters
	 * @private
	 */
	async multiPossibles(possible) {
		if (possible >= this._currentUsage.possibles.length) {
			if (this._currentUsage.type !== 'optional' || this._repeat) {
				return this.handleError(this.message.language.get('COMMANDMESSAGE_NOMATCH', this._currentUsage.possibles.map(poss => poss.name).join(', ')));
			}
			this.args.splice(this.params.length, 0, undefined);
			return this.pushParam(undefined);
		}

		if (this._currentUsage.possibles[possible].name in this.flags) this.args.splice(this.params.length, 0, this.flags[this._currentUsage.possibles[possible].name]);

		if (!this.client.argResolver[this._currentUsage.possibles[possible].type]) {
			this.client.emit('warn', 'Unknown Argument Type encountered');
			return this.multiPossibles(++possible);
		}

		try {
			const res = await this.client.argResolver[this._currentUsage.possibles[possible].type](this.args[this.params.length], this._currentUsage, possible, this._repeat, this);
			if (res !== null) return this.pushParam(res);
			return this.multiPossibles(++possible);
		} catch (err) {
			return this.multiPossibles(++possible);
		}
	}

	pushParam(param) {
		this._prompted = 0;
		this.params.push(param);
		return this.validateArgs();
	}

	async handleError(err) {
		this.args.splice(this.params.length, 1, null);
		if (this.promptLimit && this._prompted < this.promptLimit) return this.reprompt(err);
		throw err;
	}

	/**
	 * Parses a message into string args
	 * @since 0.5.0
	 * @param {string} content The remaining content
	 * @param {string} delim The delimiter
	 * @param {number} [prefixLength=0] The length of the prefix
	 * @returns {Object}
	 * @private
	 */
	static getFlags(content, delim, prefixLength = 0) {
		const flags = {};
		const prefix = content.substr(0, prefixLength);
		const [command, ...rest] = content.slice(prefixLength).trim().split(' ');
		content = rest.join(' ').replace(/--(\w+)(?:=(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|(\w+)))?/g, (match, fl, arg) => {
			flags[fl] = arg || fl;
			return '';
		}).replace(new RegExp(`(?:(\\s)\\s+|(${delim})(?:${delim})+)`, 'g'), '$1').trim();
		content = `${prefix + command} ${content}`;
		return { content, flags };
	}

	/**
	 * Parses a message into string args
	 * @since 0.0.1
	 * @param {string} content The remaining content
	 * @param {string} delim The delimiter
	 * @param {number} [prefixLength=0] The length of the prefix
	 * @returns {string[]}
	 * @private
	 */
	static getArgs(content, delim, prefixLength = 0) {
		// eslint-disable-next-line newline-per-chained-call
		const args = content.slice(prefixLength).trim().split(' ').slice(1).join(' ').trim().split(delim !== '' ? delim : undefined);
		return args.length === 1 && args[0] === '' ? [] : args;
	}

	/**
	 * Parses a message into string args taking into account quoted strings
	 * @since 0.0.1
	 * @param {string} content The remaining content
	 * @param {string} delim The delimiter
	 * @param {number} [prefixLength=0] The length of the prefix
	 * @returns {string[]}
	 * @private
	 */
	static getQuotedStringArgs(content, delim, prefixLength = 0) {
		content = content.slice(prefixLength).trim().split(' ').slice(1).join(' ').trim();

		if (!delim || delim === '') return [content];

		const args = [];
		let current = '';
		let openQuote = false;

		for (let i = 0; i < content.length; i++) {
			if (!openQuote && content.slice(i, i + delim.length) === delim) {
				if (current !== '') args.push(current);
				current = '';
				i += delim.length - 1;
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

module.exports = TextPrompter;
