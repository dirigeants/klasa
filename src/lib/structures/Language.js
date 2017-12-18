const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Languages. See {@tutorial CreatingLanguages} for more information how to use this class
 * to build custom languages.
 * @tutorial CreatingLanguages
 * @implements {Piece}
 */
class Language {

	/**
	 * @typedef {Object} LanguageOptions
	 * @property {string} [name=theFileName] The name of the language
	 * @property {boolean} [enabled=true] Whether the language is enabled or not
	 * @memberof Language
	 */

	/**
	 * @since 0.2.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user language pieces folder
	 * @param {Array} file The path from the pieces folder to the finalizer file
	 * @param {LanguageOptions} [options={}] Optional Language settings
	 */
	constructor(client, dir, file, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.languages, options);

		/**
		 * @since 0.2.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this language piece is stored
		 * @since 0.2.1
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this language is stored
		 * @since 0.2.1
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the language
		 * @since 0.2.1
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.3.0
		 * @type {string}
		 */
		this.type = 'language';

		/**
		 * If the language is enabled or not
		 * @since 0.2.1
		 * @type {boolean}
		 */
		this.enabled = options.enabled;
	}

	/**
	 * The method to get language strings
	 * @since 0.2.1
	 * @param {string} term The string or function to look up
	 * @param {...*} args Any arguments to pass to the lookup
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

	/**
	 * The init method to be optionally overwritten in actual languages
	 * @since 0.2.1
	 * @returns {void}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
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
