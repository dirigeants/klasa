const Monitor = require('./Monitor');
const Store = require('./interfaces/Store');

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
	 * Deletes a monitor from the store
	 * @since 0.0.1
	 * @param {Monitor|string} name The monitor object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const piece = this.resolve(name);
		if (!piece) return false;
		super.delete(piece.name);
		return true;
	}

	/**
	 * Runs our monitors on the message.
	 * @since 0.0.1
	 * @param {KlasaMessage} msg The message object from Discord.js
	 */
	async run(msg) {
		for (const monitor of this.values()) {
			if (!monitor.shouldRun(msg)) continue;
			try {
				await monitor.run(msg);
			} catch (err) {
				this.client.emit('monitorError', msg, monitor, err);
			}
		}
	}

	/**
	 * Sets up a monitor in our store.
	 * @since 0.0.1
	 * @param {Monitor} monitor The monitor object we are setting up
	 * @returns {Monitor}
	 */
	set(monitor) {
		if (!(monitor instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(monitor.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', monitor);
		super.set(monitor.name, monitor);
		return monitor;
	}

}

module.exports = MonitorStore;
