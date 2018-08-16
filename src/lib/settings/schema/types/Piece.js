const SchemaType = require('./base/SchemaType');

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
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {Language} language The language to throw from
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, language) {
		const store = this.client[`${piece.type}s`];
		const parsed = typeof data === 'string' ? store.get(data) : data;
		if (parsed && parsed instanceof store.holds) return parsed;
		throw language.get('RESOLVER_INVALID_PIECE', piece.key, piece.type);
	}

	serialize(data) {
		return data.name;
	}

	deserialize(data, piece) {
		const store = this.client[`${piece.type}s`];
		return Promise.resolve((store && store.get(data)) || null);
	}

}

module.exports = PieceType;
