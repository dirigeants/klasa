const Piece = require('./interfaces/Piece');

/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom monitors.
 * @tutorial CreatingMonitors
 */
class Monitor {

	/**
	 * @typedef {Object} MonitorOptions
	 * @memberof Monitor
	 * @property {string} [name = theFileName] The name of the monitor
	 * @property {boolean} [enabled=true] Whether the monitor is enabled
	 * @property {boolean} [ignoreBots=true] Whether the monitor ignores bots or not
	 * @property {boolean} [ignoreSelf=true] Whether the monitor ignores itself or not
	 */

	/**
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user monitor pieces folder
	 * @param {string} file The path from the pieces folder to the monitor file
	 * @param {MonitorOptions} [options = {}] Optional Monitor settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this monitor piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this monitor is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the monitor
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'monitor';

		/**
		 * If the monitor is enabled or not
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * Whether the monitor ignores bots or not
		 * @type {boolean}
		 */
		this.ignoreBots = 'ignoreBots' in options ? options.ignoreBots : true;

		/**
		 * Whether the monitor ignores itself or not
		 * @type {boolean}
		 */
		this.ignoreSelf = 'ignoreSelf' in options ? options.ignoreSelf : true;
	}

	/**
	 * The run method to be overwritten in actual monitor pieces
	 * @param {external:Message} msg The discord message
	 * @abstract
	 * @returns {void}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual monitor pieces
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

Piece.applyToClass(Monitor);

module.exports = Monitor;
