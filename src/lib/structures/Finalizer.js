const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 * @extends {Piece}
 */
class Finalizer extends Piece {

	/**
	 * @typedef {PieceOptions} FinalizerOptions
	 */

	/**
	 * The run method to be overwritten in actual finalizers
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message used to trigger this finalizer
	 * @param {KlasaMessage|KlasaMessage[]} mes The bot's response message, if one is returned
	 * @param {number} start The performance now start time including all command overhead
	 * @returns {void}
	 * @abstract
	 */
	async run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionally overwritten in actual finalizer pieces.
	 * @since 0.0.1
	 * @returns {Promise<*>}
	 * @name Finalizer#init
	 * @abstract
	 */

}

module.exports = Finalizer;
