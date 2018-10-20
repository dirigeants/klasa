const { mergeDefault } = require('../../util/util');

/**
 * Contains static methods for pieces with aliases
 * @see Piece
 * @see Command
 * @see Argument
 * @see Serializer
 */
class AliasPiece {

	/**
	 * @typedef {PieceOptions} AliasPieceOptions
	 * @property {string[]} [aliases=[]] The aliases for this piece
	 */

	/**
	 * This class may not be initiated with new
	 * @throws {Error}
	 * @private
	 */
	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	/**
	 * Install aliases in a piece
	 * @param {Piece} piece The piece to alias
	 * @param {AliasPieceOptions} options The options for this piece
	 */
	static aliasPiece(piece, options) {
		const defaults = piece.client.options.pieceDefaults.aliasedPieces;
		if (defaults) options = mergeDefault(defaults, options);

		/**
		 * The aliases for this piece
		 * @since 0.5.0
		 * @type {string[]}
		 */
		piece.aliases = options.aliases;

		piece.toJSON = AliasPiece.patchToJSON(piece.toJSON);
	}

	/**
	 * Returns a method that can be patched into a piece's toJSON method.
	 * @param {function():Object} superToJSON The class's native toJSON method
	 * @returns {function():Object} A function to patch with
	 */
	static patchToJSON(superToJSON) {
		/**
		 * Defines the JSON.stringify behavior of this argument.
		 * @since 0.5.0
		 * @this Piece
		 * @returns {Object}
		 */
		function toJSON() {
			return {
				...superToJSON(),
				aliases: this.aliases.slice(0)
			};
		}
		return toJSON;
	}

}

module.exports = AliasPiece;
