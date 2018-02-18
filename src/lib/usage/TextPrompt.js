const { mergeDefault } = require('../util/util');
const quotes = ['"', "'", '“”', '‘’'];

/**
 * A class to handle argument collection and parameter resolution
 */
class TextPrompt {

	/**
	 * @typedef {Object} TextPromptOptions
	 * @property {number} [promptLimit=Infinity] The number of re-prompts before this TextPrompt gives up
	 * @property {number} [promptTime=30000] The time-limit for re-prompting
	 * @property {boolean} [quotedStringSupport=false] Whether this prompt should respect quoted strings
	 * @memberof TextPrompt
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The message this prompt is for
	 * @param {Usage} usage The usage for this prompt
	 * @param {TextPromptOptions} options The options of this prompt
	 */
	constructor(msg, usage, options) {
		options = mergeDefault(msg.client.options.customPromptDefaults, options);

		/**
		 * The client this TextPrompt was created with
		 * @since 0.5.0
		 * @name TextPrompt#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: msg.client });

		/**
		 * The message this prompt is for
		 * @since 0.5.0
		 * @type {KlasaMessage}
		 */
		this.message = msg;

		/**
		 * The usage for this prompt
		 * @since 0.5.0
		 * @type {Usage|CommandUsage}
		 */
		this.usage = usage;

		/**
		 * If the command reprompted for missing args
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.reprompted = false;

		/**
		 * The flag arguments resolved by this class
		 * @since 0.5.0
		 * @type {Object}
		 */
		this.flags = {};

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
		 * The time-limit for re-prompting
		 * @since 0.5.0
		 * @type {number}
		 */
		this.promptTime = options.promptTime;

		/**
		 * The number of re-prompts before this TextPrompt gives up
		 * @since 0.5.0
		 * @type {number}
		 */
		this.promptLimit = options.promptLimit;

		/**
		 * Whether this prompt should respect quoted strings
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.quotedStringSupport = options.quotedStringSupport;

		/**
		 * Whether the current usage is a repeating arg
		 * @since 0.0.1
		 * @type {boolean}
		 * @private
		 */
		this._repeat = false;

		/**
		 * Whether the current usage is required
		 * @since 0.0.1
		 * @type {number}
		 * @private
		 */
		this._required = 0;

		/**
		 * How many time this class has reprompted
		 * @since 0.0.1
		 * @type {boolean}
		 * @private
		 */
		this._prompted = 0;

		/**
		 * A cache of the current usage while validating
		 * @since 0.0.1
		 * @type {Tag}
		 * @private
		 */
		this._currentUsage = {};
	}

	/**
	 * Runs the custom prompt.
	 * @since 0.5.0
	 * @param {string} prompt The message to initially prompt with
	 * @returns {any[]} The parameters resolved
	 */
	async run(prompt) {
		const message = await this.message.prompt(prompt, this.promptTime);
		this._setup(message.content);
		return this.validateArgs();
	}

	/**
	 * Collects missing required arguments.
	 * @since 0.5.0
	 * @param {string} prompt The reprompt error
	 * @returns {any[]}
	 * @private
	 */
	async reprompt(prompt) {
		this._prompted++;
		if (this.typing) this.message.channel.stopTyping();
		const message = await this.message.prompt(
			this.message.language.get('MONITOR_COMMAND_HANDLER_REPROMPT', `<@!${this.message.author.id}>`, prompt, this.promptTime / 1000),
			this.promptTime
		);

		if (message.content.toLowerCase() === 'abort') throw this.message.language.get('MONITOR_COMMAND_HANDLER_ABORTED');

		if (this.typing) this.message.channel.startTyping();
		this.args[this.args.lastIndexOf(null)] = message.content;
		this.reprompted = true;

		if (this.usage.parsedUsage[this.params.length + 1] && this.usage.parsedUsage[this.params.length + 1].type === 'repeat') {
			return this.repeatingPrompt(prompt);
		}

		return this.validateArgs();
	}

	/**
	 * Collects repeating arguments.
	 * @since 0.5.0
	 * @returns {any[]}
	 * @private
	 */
	async repeatingPrompt() {
		if (this.typing) this.message.channel.stopTyping();
		let message;

		try {
			message = await this.message.prompt(
				this.message.language.get('MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT', `<@!${this.message.author.id}>`, this._currentUsage.possibles[0].name, this.promptTime / 1000),
				this.promptTime
			);
		} catch (err) {
			return this.validateArgs();
		}

		if (message.content.toLowerCase() === 'cancel') return this.validateArgs();

		if (this.typing) this.message.channel.startTyping();
		this.args.push(message.content);
		this.reprompted = true;

		return this.repeatingPrompt();
	}

	/**
	 * Validates and resolves args into parameters
	 * @since 0.0.1
	 * @returns {any[]} The resolved parameters
	 * @private
	 */
	async validateArgs() {
		if (this.params.length >= this.usage.parsedUsage.length && this.params.length >= this.args.length) {
			return this.finalize();
		} else if (this.usage.parsedUsage[this.params.length]) {
			this._currentUsage = this.usage.parsedUsage[this.params.length];
			this._required = this._currentUsage.required;
		} else if (this._currentUsage.repeat) {
			this._required = 0;
			this._repeat = true;
		} else {
			return this.finalize();
		}

		return this.multiPossibles(0);
	}

	/**
	 * Validates and resolves args into parameters, when multiple types of usage is defined
	 * @since 0.0.1
	 * @param {number} index The id of the possible usage currently being checked
	 * @returns {any[]} The resolved parameters
	 * @private
	 */
	async multiPossibles(index) {
		const possible = this._currentUsage.possibles[index];
		const custom = this.usage.customResolvers[possible.type];

		if (possible.name in this.flags) this.args.splice(this.params.length, 0, this.flags[possible.name]);
		if (!this.client.argResolver[possible.type] && !custom) {
			this.client.emit('warn', `Unknown Argument Type encountered: ${possible.type}`);
			if (this._currentUsage.possibles.length === 1) return this.pushParam(undefined);
			return this.multiPossibles(++index);
		}

		try {
			const res = await this.client.argResolver[custom ? 'custom' : possible.type](this.args[this.params.length], possible, this.message, custom);
			if (typeof res === 'undefined' && this._required === 1) this.args.splice(this.params.length, 0, undefined);
			return this.pushParam(res);
		} catch (err) {
			if (index < this._currentUsage.possibles.length - 1) return this.multiPossibles(++index);
			if (!this._required) {
				this.args.splice(this.params.length, 0, undefined);
				return this.pushParam(undefined);
			}

			const { response } = this._currentUsage;
			const error = typeof response === 'function' ? response(this.message, possible) : response;

			if (this._required === 1) return this.handleError(error || err);
			if (this._currentUsage.possibles.length === 1) {
				return this.handleError(error || this.args[this.params.length] === undefined ? this.message.language.get('COMMANDMESSAGE_MISSING_REQUIRED', possible.name) : err);
			}
			return this.handleError(error || this.message.language.get('COMMANDMESSAGE_NOMATCH', this._currentUsage.possibles.map(poss => poss.name).join(', ')));
		}
	}

	/**
	 * Pushes a parameter into this.params, and resets the re-prompt count.
	 * @since 0.5.0
	 * @param {any} param The resolved parameter
	 * @returns {any[]}
	 * @private
	 */
	pushParam(param) {
		this._prompted = 0;
		this.params.push(param);
		return this.validateArgs();
	}

	/**
	 * Decides if the prompter should reprompt or throw the error found while validating.
	 * @since 0.5.0
	 * @param {string} err The error found while validating
	 * @returns {any[]}
	 * @private
	 */
	async handleError(err) {
		this.args.splice(this.params.length, 1, null);
		if (this.promptLimit && this._prompted < this.promptLimit) return this.reprompt(err);
		throw err;
	}

	/**
	 * Finalizes parameters and arguments for this prompt.
	 * @since 0.5.0
	 * @returns {any[]}
	 * @private
	 */
	finalize() {
		for (let i = this.params.length - 1; i >= 0 && this.params[i] === undefined; i--) this.params.pop();
		for (let i = this.args.length - 1; i >= 0 && this.args[i] === undefined; i--) this.args.pop();
		return this.params;
	}

	/**
	 * Splits the original message string into arguments.
	 * @since 0.5.0
	 * @param {string} original The original message string
	 * @returns {void}
	 * @private
	 */
	_setup(original) {
		const { content, flags } = this.constructor.getFlags(original, this.usage.usageDelim);
		this.flags = flags;
		this.args = this.quotedStringSupport ?
			this.constructor.getQuotedStringArgs(content, this.usage.usageDelim).map(arg => arg.trim()) :
			this.constructor.getArgs(content, this.usage.usageDelim).map(arg => arg.trim());
	}

	/**
	 * Parses a message into string args
	 * @since 0.5.0
	 * @param {string} content The remaining content
	 * @param {string} delim The delimiter
	 * @returns {Object}
	 * @private
	 */
	static getFlags(content, delim) {
		const flags = {};
		content = content.replace(TextPrompt.flagRegex, (match, fl, ...quote) => {
			flags[fl] = (quote.slice(0, -2).find(el => el) || fl).replace(/\\/g, '');
			return '';
		}).replace(new RegExp(`(?:(\\s)\\s+|(${delim})(?:${delim})+)`, 'g'), '$1').trim();
		return { content, flags };
	}

	/**
	 * Parses a message into string args
	 * @since 0.0.1
	 * @param {string} content The remaining content
	 * @param {string} delim The delimiter
	 * @returns {string[]}
	 * @private
	 */
	static getArgs(content, delim) {
		const args = content.replace(new RegExp(`(${delim})(?:${delim})+`, 'g'), '$1').split(delim !== '' ? delim : undefined);
		return args.length === 1 && args[0] === '' ? [] : args;
	}

	/**
	 * Parses a message into string args taking into account quoted strings
	 * @since 0.0.1
	 * @param {string} content The remaining content
	 * @param {string} delim The delimiter
	 * @returns {string[]}
	 * @private
	 */
	static getQuotedStringArgs(content, delim) {
		if (!delim || delim === '') return [content];

		const args = [];

		for (let i = 0; i < content.length; i++) {
			let current = '';
			if (content.slice(i, i + delim.length) === delim) {
				i += delim.length - 1;
				continue;
			}
			const quote = quotes.find(qt => qt.includes(content[i]));
			if (quote) {
				const qts = quote.split('');
				while (i + 1 < content.length && (content[i] === '\\' || !qts.includes(content[i + 1]))) current += content[++i] !== '\\' ? content[i] : '';
				i++;
				args.push(current);
			} else {
				current += content[i];
				while (i + 1 < content.length && content.slice(i + 1, i + delim.length + 1) !== delim) current += content[++i];
				args.push(current);
			}
		}

		return args.length === 1 && args[0] === '' ? [] : args;
	}

}

/**
 * Regular Expression to match flags with quoted string support.
 * @since 0.5.0
 * @type {RegExp}
 * @static
 */
TextPrompt.flagRegex = new RegExp(`--(\\w[\\w-]+)(?:=(?:${quotes.map(qu => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join('|')}|([\\w-]+)))?`, 'g');

module.exports = TextPrompt;
