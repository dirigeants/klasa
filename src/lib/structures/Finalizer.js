/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 */
class Finalizer {

	/**
	 * @typedef {Object} FinalizerOptions
	 * @property {string} [name = theFileName] The name of the finalizer
	 * @property {boolean} [enabled=true] Whether the finalizer is enabled or not
	 */

	/**
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user finalizer pieces folder
	 * @param {Array} file The path from the pieces folder to the finalizer file
	 * @param {FinalizerOptions} [options = {}] Optional Finalizer settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this finalizer piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this finalizer is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the finalizer
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'finalizer';

		/**
		 * If the finalizer is enabled or not
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;
	}

	/**
	 * Reloads this finalizer
	 * @returns {Promise<Finalizer>} The newly loaded finalizer
	 */
	async reload() {
		const fin = this.client.finalizers.load(this.dir, this.file);
		await fin.init();
		return fin;
	}

	/**
	 * Unloads this finalizer
	 * @returns {void}
	 */
	unload() {
		return this.client.finalizers.delete(this);
	}

	/**
	 * Disables this finalizer
	 * @returns {Finalizer} This finalizer
	 */
	disable() {
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this finalizer
	 * @returns {Finalizer} This finalizer
	 */
	enable() {
		this.enabled = true;
		return this;
	}

	/**
	 * The run method to be overwritten in actual finalizers
	 * @param {CommandMessage} msg The command message mapped on top of the message used to trigger this finalizer
	 * @param {external:Message} mes The bot's response message, if one is returned
	 * @param {external:Now} start The performance now start time including all command overhead
	 * @abstract
	 * @returns {void}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual finalizers
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Finalizer;
