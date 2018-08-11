const SchemaType = require('./base/SchemaType');
const URL = require('url');

/**
 * class that resolves urls
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class UrlType extends SchemaType {

	/**
	 * Resolves our data into an URL
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language) {
		const url = URL.parse(data);
		if (url.protocol && url.hostname) return data;
		throw language.get('RESOLVER_INVALID_URL', piece.key);
	}

}

module.exports = UrlType;
