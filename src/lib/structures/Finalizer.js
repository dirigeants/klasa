const Piece = require('./interfaces/Piece');

/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 * @implements {Piece}
 */
class Finalizer {

	/**
	 * @typedef {Object} FinalizerOptions
	 * @memberof Finalizer
	 * @property {string} [name = theFileName] The name of the finalizer
	 * @property {boolean} [enabled=true] Whether the finalizer is enabled or not
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user finalizer pieces folder
	 * @param {string} file The path from the pieces folder to the finalizer file
	 * @param {FinalizerOptions} [options = {}] Optional Finalizer settings
	 */
	constructor(client, dir, file, options = {}) {
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
		this.enabled = 'enabled' in options ? options.enabled : true;
	}

	/**
	 * The run method to be overwritten in actual finalizers
	 * @since 0.0.1
	 * @param {CommandMessage} msg The command message mapped on top of the message used to trigger this finalizer
	 * @param {external:Message} mes The bot's response message, if one is returned
	 * @param {number} start The performance now start time including all command overhead
	 * @abstract
	 * @returns {void}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual finalizers
	 * @since 0.0.1
	 * @abstract
	 * @returns {void}
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
