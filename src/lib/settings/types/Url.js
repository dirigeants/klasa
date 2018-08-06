const Type = require('./Type');
const URL = require('url');

/**
  * class that resolves urls
  * @extends SchemaType
	* @since 0.5.0
	* @private
	*/
class UrlType extends Type {

	/**
	  * Resolves our data into an URL
	  * @since 0.5.0
		* @param {*} data The data to resolve
		* @param {SchemaPiece} piece The piece this data should be resolving to
		* @param {?external:Guild} guild The Guild instance that should be used for this piece
		* @returns {*} The resolved data
		*/
	async resolve(data, piece, guild) {
		const url = URL.parse(data);
		if (url.protocol && url.hostname) return data;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_URL', piece.key);
	}

}

module.exports = UrlType;
