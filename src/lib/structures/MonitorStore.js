const Monitor = require('./Monitor');
const Store = require('./base/Store');

/**
 * Stores all monitors for use in Klasa
 * @extends Store
 */
class MonitorStore extends Store {

	/**
	 * Constructs our MonitorStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client, 'monitors', Monitor);
	}

	/**
	 * Runs our monitors on the message.
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message object from Discord.js
	 * @param {boolean} [edit=false] If the run is a message edit
	 */
	run(msg, edit = false) {
		for (const monitor of this.values()) if (monitor.shouldRun(msg, edit)) this._run(msg, monitor);
	}

	/**
	 * Run a monitor and catch any uncaught promises
	 * @since 0.5.0
	 * @param {KlasaMessage} msg The message object from Discord.js
	 * @param {Monitor} monitor The monitor to run
	 * @private
	 */
	async _run(msg, monitor) {
		try {
			await monitor.run(msg);
		} catch (err) {
			this.client.emit('monitorError', msg, monitor, err);
		}
	}

}

module.exports = MonitorStore;
