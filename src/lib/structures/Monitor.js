const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom monitors.
 * @tutorial CreatingMonitors
 * @extends Piece
 */
class Monitor extends Piece {

	/**
	 * @typedef {PieceOptions} MonitorOptions
	 * @property {boolean} [ignoreBots=true] Whether the monitor ignores bots or not
	 * @property {boolean} [ignoreSelf=true] Whether the monitor ignores itself or not
	 * @property {boolean} [ignoreOthers=true] Whether the monitor ignores others or not
	 * @property {boolean} [ignoreWebhooks=true] Whether the monitor ignores webhooks or not
	 * @memberof Monitor
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {MonitorStore} store The Monitor Store
	 * @param {string} file The path from the pieces folder to the monitor file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {MonitorOptions} [options={}] Optional Monitor settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * Whether the monitor ignores bots or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.ignoreBots = options.ignoreBots;

		/**
		 * Whether the monitor ignores itself or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.ignoreSelf = options.ignoreSelf;

		/**
		 * Whether the monitor ignores others or not
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.ignoreOthers = options.ignoreOthers;

		/**
		 * Whether the monitor ignores webhooks or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.ignoreWebhooks = options.ignoreWebhooks;
	}

	/**
	 * The run method to be overwritten in actual monitor pieces
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The discord message
	 * @returns {void}
	 * @abstract
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionally overwritten in actual monitor pieces
	 * @since 0.0.1
	 * @returns {void}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
	}

	/**
	 * If the monitor should run based on the filter options
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The message to check
	 * @returns {boolean}
	 */
	shouldRun(msg) {
		return this.enabled &&
			!(this.ignoreBots && msg.author.bot) &&
			!(this.ignoreSelf && this.client.user === msg.author) &&
			!(this.ignoreOthers && this.client.user !== msg.author) &&
			!(this.ignoreWebhooks && msg.webhookID);
	}

	/**
	 * Defines the JSON.stringify behavior of this monitor.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			ignoreBots: this.ignoreBots,
			ignoreSelf: this.ignoreSelf,
			ignoreOthers: this.ignoreOthers,
			ignoreWebhooks: this.ignoreWebhooks
		};
	}

}

module.exports = Monitor;
