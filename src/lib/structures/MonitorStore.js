const { join } = require('path');
const { Collection } = require('discord.js');
const Monitor = require('./Monitor');
const Store = require('./interfaces/Store');

/**
 * Stores all monitors for use in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class MonitorStore extends Collection {

	/**
	 * Constructs our MonitorStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super();

		/**
		 * The client this MonitorStore was created with.
		 * @since 0.0.1
		 * @name MonitorStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of monitors in Klasa relative to where its installed.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'monitors');

		/**
		 * The directory of local monitors relative to where you run Klasa from.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'monitors');

		/**
		 * The type of structure this store holds
		 * @since 0.1.1
		 * @type {Inhibitor}
		 */
		this.holds = Monitor;

		/**
		 * The name of what this holds
		 * @since 0.3.0
		 * @type {String}
		 */
		this.name = 'monitors';
	}

	/**
	 * Deletes a monitor from the store
	 * @since 0.0.1
	 * @param {Monitor|string} name The monitor object or a string representing the structure this store caches
	 * @return {boolean} whether or not the delete was successful.
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
			if (monitor.enabled && !(monitor.ignoreBots && msg.author.bot) && !(monitor.ignoreSelf && this.client.user === msg.author) && !(monitor.ignoreOthers && this.client.user !== msg.author)) {
				try {
					await monitor.run(msg);
				} catch (err) {
					this.client.emit('monitorError', msg, monitor, err);
				}
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

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(MonitorStore);

module.exports = MonitorStore;
