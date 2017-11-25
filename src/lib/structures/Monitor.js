const Piece = require('./interfaces/Piece');

/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom monitors.
 * @tutorial CreatingMonitors
 * @implements {Piece}
 */
class Monitor {

	/**
	 * @typedef {Object} MonitorOptions
	 * @memberof Monitor
	 * @property {string} [name = theFileName] The name of the monitor
	 * @property {boolean} [enabled=true] Whether the monitor is enabled or not
	 * @property {boolean} [ignoreBots=true] Whether the monitor ignores bots or not
	 * @property {boolean} [ignoreSelf=true] Whether the monitor ignores itself or not
	 * @property {boolean} [ignoreOthers=true] Whether the monitor ignores others or not
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user monitor pieces folder
	 * @param {string} file The path from the pieces folder to the monitor file
	 * @param {MonitorOptions} [options = {}] Optional Monitor settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this monitor piece is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this monitor is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the monitor
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = 'monitor';

		/**
		 * If the monitor is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * Whether the monitor ignores bots or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.ignoreBots = 'ignoreBots' in options ? options.ignoreBots : true;

		/**
		 * Whether the monitor ignores itself or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.ignoreSelf = 'ignoreSelf' in options ? options.ignoreSelf : true;

		/**
		 * Whether the monitor ignores others or not
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.ignoreOthers = 'ignoreOthers' in options ? options.ignoreOthers : true;
	}

	/**
	 * The run method to be overwritten in actual monitor pieces
	 * @since 0.0.1
	 * @param {external:Message} msg The discord message
	 * @abstract
	 * @returns {void}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual monitor pieces
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

Piece.applyToClass(Monitor);

module.exports = Monitor;
