const { pathExists } = require('fs-nextra');
const { join } = require('path');
const Piece = require('./base/Piece');
const { mergeDefault, isClass } = require('../util/util');

/**
 * Base class for all Klasa Languages. See {@tutorial CreatingLanguages} for more information how to use this class
 * to build custom languages.
 * @tutorial CreatingLanguages
 * @extends Piece
 */
class Language extends Piece {

	/**
	 * @typedef {PieceOptions} LanguageOptions
	 */

	/**
	 * The method to get language strings
	 * @since 0.2.1
	 * @param {string} term The string or function to look up
	 * @param {...*} args Any arguments to pass to the lookup
	 * @returns {string|Function}
	 */
	get(term, ...args) {
		if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
		/* eslint-disable new-cap */
		if (!this.language[term]) {
			if (this === this.store.default) return this.language.DEFAULT(term);
			return [
				`${this.language.DEFAULT(term)}`,
				'',
				`**${this.language.DEFAULT_LANGUAGE}:**`,
				`${(args.length ? this.store.default.language[term](...args) : this.store.default.language[term]) || this.store.default.language.DEFAULT(term)}`
			].join('\n');
		}
		/* eslint-enable new-cap */
		return args.length ? this.language[term](...args) : this.language[term];
	}

	/**
	 * The init method to be optionally overwritten in actual languages
	 * @since 0.2.1
	 * @returns {void}
	 * @abstract
	 */
	async init() {
		const loc = join(this.store.coreDir, ...this.file);
		if (this.dir !== this.store.coreDir && await pathExists(loc)) {
			try {
				const CorePiece = require(loc);
				if (!isClass(CorePiece)) return;
				const coreLang = new CorePiece(this.client, this.store, this.file, true);
				this.language = mergeDefault(coreLang.language, this.language);
			} catch (error) {
				return;
			}
		}
		return;
	}

}

module.exports = Language;
