const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 * @extends {Piece}
 */
class Finalizer extends Piece {

	/**
	 * @typedef {Object} FinalizerOptions
	 * @property {string} [name=theFileName] The name of the finalizer
	 * @property {boolean} [enabled=true] Whether the finalizer is enabled or not
	 * @memberof Finalizer
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} file The path from the pieces folder to the finalizer file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {FinalizerOptions} [options={}] Optional Finalizer settings
	 */
	constructor(client, file, core, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.finalizers, options);
		super(client, 'finalizer', file, core, options);
	}

	/**
	 * The run method to be overwritten in actual finalizers
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message used to trigger this finalizer
	 * @param {KlasaMessage|KlasaMessage[]} mes The bot's response message, if one is returned
	 * @param {number} start The performance now start time including all command overhead
	 * @returns {void}
	 * @abstract
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionally overwritten in actual finalizers
	 * @since 0.0.1
	 * @returns {void}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Finalizer;
