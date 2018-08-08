const SchemaType = require('./SchemaType');

/**
 * Class that resolves languages
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class CommandType extends SchemaType {

	/**
	 * Resolves our data into a language
	 * @since 0.5.0
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, guild) {
		const language = this.client.languages.get(data);
		if (language) return language.name;
		throw (guild ? guild.language : this.client.languages.default).get('RESOLVER_INVALID_PIECE', piece.key, 'language');
	}

}

module.exports = CommandType;
