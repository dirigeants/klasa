const Tag = require('./Tag');
const TextPrompt = require('./TextPrompt');

/**
 * Converts usage strings into objects to compare against later
 */
class ParsedUsage {

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The klasa client
	 * @param {string} usageString The raw usage string
	 * @param {string} usageDelim The deliminator for this usage
	 */
	constructor(client, usageString, usageDelim) {
		/**
		 * The client this ParsedUsage was created with
		 * @since 0.0.1
		 * @name ParsedUsage#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The usage string re-deliminated with the usageDelim
		 * @since 0.0.1
		 * @type {string}
		 */
		this.deliminatedUsage = usageString !== '' ? ` ${usageString.split(' ').join(usageDelim)}` : '';

		/**
		 * The usage string
		 * @since 0.0.1
		 * @type {string}
		 */
		this.usageString = usageString;

		/**
		 * The usage delim
		 * @since 0.5.0
		 * @type {string}
		 */
		this.usageDelim = usageDelim;

		/**
		 * The usage object to compare against later
		 * @since 0.0.1
		 * @type {Tag[]}
		 */
		this.parsedUsage = this.constructor.parseUsage(this.usageString);
	}

	/**
	 * Creates a TextPrompt instance to collect and resolve arguments with.
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The message context from the prompt
	 * @param {TextPromptOptions} [options] The options for the prompt
	 * @returns {TextPrompt}
	 */
	createPrompt(msg, options = {}) {
		return new TextPrompt(msg, this, options);
	}

	/**
	 * Defines json stringify behavior of this class.
	 * @since 0.5.0
	 * @returns {Tag[]}
	 */
	toJSON() {
		return this.parsedUsage;
	}

	/**
	 * Defines to string behavior of this class.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return this.deliminatedUsage;
	}

	/**
	 * Method responsible for building the usage object to check against
	 * @since 0.0.1
	 * @param {string} usageString The usage string to parse
	 * @returns {Tag[]}
	 * @private
	 */
	static parseUsage(usageString) {
		let usage = {
			tags: [],
			opened: 0,
			current: '',
			openRegex: false,
			openReq: false,
			last: false,
			char: 0,
			from: 0,
			at: '',
			fromTo: ''
		};

		for (let i = 0; i < usageString.length; i++) {
			const char = usageString[i];
			usage.char = i + 1;
			usage.from = usage.char - usage.current.length;
			usage.at = `at char #${usage.char} '${char}'`;
			usage.fromTo = `from char #${usage.from} to #${usage.char} '${usage.current}'`;

			if (usage.last && char !== ' ') throw `${usage.at}: there can't be anything else after the repeat tag.`;

			if (char === '/' && usage.current[usage.current.length - 1] !== '\\') usage.openRegex = !usage.openRegex;

			if (usage.openRegex) {
				usage.current += char;
				continue;
			}

			if (['<', '['].includes(char)) usage = ParsedUsage.tagOpen(usage, char);
			else if (['>', ']'].includes(char)) usage = ParsedUsage.tagClose(usage, char);
			else if ([' ', '\n'].includes(char)) usage = ParsedUsage.tagSpace(usage, char);
			else usage.current += char;
		}

		if (usage.opened) throw `from char #${usageString.length - usage.current.length} '${usageString.substr(-usage.current.length - 1)}' to end: a tag was left open`;
		if (usage.current) throw `from char #${(usageString.length + 1) - usage.current.length} to end '${usage.current}' a literal was found outside a tag.`;

		return usage.tags;
	}

	/**
	 * Method responsible for handling tag opens
	 * @since 0.0.1
	 * @param {Object} usage The current usage interim object
	 * @param {string} char The character that triggered this function
	 * @returns {Object} The current usage interim object
	 * @private
	 */
	static tagOpen(usage, char) {
		if (usage.opened) throw `${usage.at}: you may not open a tag inside another tag.`;
		if (usage.current) throw `${usage.fromTo}: there can't be a literal outside a tag`;
		usage.opened++;
		usage.openReq = char === '<';
		return usage;
	}

	/**
	 * Method responsible for handling tag closes
	 * @since 0.0.1
	 * @param {Object} usage The current usage interim object
	 * @param {string} char The character that triggered this function
	 * @returns {Object} The current usage interim object
	 * @private
	 */
	static tagClose(usage, char) {
		const required = char === '>';
		if (!usage.opened) throw `${usage.at}: invalid close tag found`;
		if (!usage.openReq && required) throw `${usage.at}: Invalid closure of '[${usage.current}' with '>'`;
		if (usage.openReq && !required) throw `${usage.at}: Invalid closure of '<${usage.current}' with ']'`;
		if (!usage.current) throw `${usage.at}: empty tag found`;
		usage.opened--;
		if (usage.current === '...') {
			if (usage.openReq) throw `${usage.at}: repeat tag cannot be required`;
			if (usage.tags.length < 1) throw `${usage.fromTo}: there can't be a repeat at the beginning`;
			usage.tags.push({ type: 'repeat' });
			usage.last = true;
		} else {
			usage.tags.push(new Tag(usage.current, usage.tags.length + 1, required));
		}
		usage.current = '';
		return usage;
	}

	/**
	 * Method responsible for handling tag spacing
	 * @since 0.0.1
	 * @param {Object} usage The current usage in the object
	 * @param {string} char The character that triggered this function
	 * @returns {Object} The current usage in the object
	 * @private
	 */
	static tagSpace(usage, char) {
		if (char === '\n') throw `${usage.at}: there can't be a line break in the usage string`;
		if (usage.opened) throw `${usage.at}: spaces aren't allowed inside a tag`;
		if (usage.current) throw `${usage.fromTo}: there can't be a literal outside a tag.`;
		return usage;
	}

}

module.exports = ParsedUsage;
