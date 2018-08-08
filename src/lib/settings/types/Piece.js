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
	 * @param {*} data The data to resolve
	 * @param {SchemaPiece} piece The piece this data should be resolving to
	 * @param {?external:Guild} guild The Guild instance that should be used for this piece
	 * @returns {*} The resolved data
	 */
	async resolve(data, piece, guild) {
		const Piece = require('klasa')[piece.type];
		if (Piece && data instanceof Piece) return data;
		let pie;
		const store = this.client.pieceStores.get(piece.type);
		if (store) pie = store.get(data);
		if (pie) return pie;
		throw (guild ? guild.languauge : this.client.languages.default).get('RESOLVER_INVALID_PIECE', piece.key, piece.type);
	}

}

module.exports = PieceType;
