const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 * @implements {Piece}
 */
class Finalizer {

	/**
	 * @typedef {Object} FinalizerOptions
	 * @property {string} [name=theFileName] The name of the finalizer
	 * @property {boolean} [enabled=true] Whether the finalizer is enabled or not
	 * @memberof Finalizer
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user finalizer pieces folder
	 * @param {string} file The path from the pieces folder to the finalizer file
	 * @param {FinalizerOptions} [options={}] Optional Finalizer settings
	 */
	constructor(client, dir, file, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.finalizers, options);

		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this finalizer piece is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this finalizer is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the finalizer
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = 'finalizer';

		/**
		 * If the finalizer is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = options.enabled;
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

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Finalizer);

module.exports = Finalizer;
