/**
 * Base class for all Klasa Monitors. See {@tutorial CreatingMonitors} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingMonitors
 */
class Monitor {

	/**
	 * @typedef {Object} MonitorOptions
	 * @property {boolean} [enabled=true] Whether the monitor is enabled
	 * @property {boolean} [ignoreBots=true] Whether the monitor ignores bots
	 * @property {boolean} [ignoreSelf=true] Whether the monitor ignores itself
	 */

	/**
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user monitor pieces folder
	 * @param {string} file The path from the pieces folder to the monitor file
	 * @param {string} name The name of the monitor
	 * @param {MonitorOptions} [options = {}] Optional Monitor settings
	 */
	constructor(client, dir, file, name, options = {}) {
		this.client = client;
		this.dir = dir;
		this.file = file;
		this.name = name;
		this.type = 'monitor';
		this.enabled = options.enabled || true;
		this.ignoreBots = options.ignoreBots || true;
		this.ignoreSelf = options.ignoreSelf || true;
	}

	/**
	 * Reloads this monitor
	 * @returns {Promise<Monitor>} The newly loaded monitor
	 */
	async reload() {
		const mon = this.client.monitors.load(this.dir, this.file);
		await mon.init();
		return mon;
	}

	/**
	 * Unloads this monitor
	 * @returns {void}
	 */
	unload() {
		return this.client.monitors.delete(this);
	}

	/**
	 * Disables this monitor
	 * @returns {Monitor} This monitor
	 */
	disable() {
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this monitor
	 * @returns {Monitor} This monitor
	 */
	enable() {
		this.enabled = true;
		return this;
	}

	/**
	 * The run method to be overwritten in actual event handlers
	 * @param {external:Message} msg The discord message
	 * @abstract
	 * @returns {void}
	 */
	run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual events
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Monitor;
