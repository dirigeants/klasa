const SchemaType = require('./SchemaType');

/**
 * class that resolves Klasa Pieces
 * @extends SchemaType
 * @since 0.5.0
 * @private
 */
class PieceType extends SchemaType {


	/**
	 * Resolves our data into a Klasa Piece
	 * @since 0.5.0
	 * @param {KlasaClient} client The KlasaClient
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(client, data, piece, guild) {
		const store = client[`${piece.type}s`];
		const parsed = typeof data === 'string' ? store.get(data) : data;
		if (parsed && parsed instanceof store.holds) return parsed.name;
		throw (guild ? guild.language : client.languages.default).get('RESOLVER_INVALID_PIECE', piece.key, piece.type);
	}

}

module.exports = PieceType;
