const Piece = require('./interfaces/Piece');

/**
 * Base class for all Klasa Languages. See {@tutorial CreatingLanguages} for more information how to use this class
 * to build custom languages.
 * @tutorial CreatingLanguages
 * @implements {Piece}
 */
class Language {

	/**
	 * @typedef {Object} LanguageOptions
	 * @memberof Language
	 * @property {string} [name = theFileName] The name of the finalizer
	 * @property {boolean} [enabled=true] Whether the finalizer is enabled or not
	 */

	/**
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user language pieces folder
	 * @param {Array} file The path from the pieces folder to the finalizer file
	 * @param {LanguageOptions} [options = {}] Optional Language settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this language piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this language is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the finalizer
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'language';

		/**
		 * If the language is enabled or not
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;
	}

	/**
	 * The method to get language strings
	 * @param {string} term The string or function to look up
	 * @param {...any} args Any arguments to pass to the lookup
	 * @returns {string|Function}
	 */
	get(term, ...args) {
		if (!this.enabled && this !== this.client.languages.default) return this.client.languages.default.get(term, ...args);
		/* eslint-disable new-cap */
		if (!this.language[term]) {
			if (this === this.client.languages.default) return this.language.DEFAULT(term);
			return [
				`${this.language.DEFAULT(term)}`,
				'',
				`**${this.language.DEFAULT_LANGUAGE}:**`,
				`${(args.length > 0 ? this.client.languages.default.language[term](...args) : this.client.languages.default.language[term]) || this.client.languages.default.language.DEFAULT(term)}`
			].join('\n');
		}
		/* eslint-enable new-cap */
		return args.length > 0 ? this.language[term](...args) : this.language[term];
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Language);

module.exports = Language;
