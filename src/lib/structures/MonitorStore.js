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
	 * @param  {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super();
		/**
		 * The client this MonitorStore was created with.
		 * @name MonitorStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		* The directory of monitors in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'monitors');

		/**
		* The directory of local monitors relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'monitors');

		/**
		 * The type of structure this store holds
		 * @type {Inhibitor}
		 */
		this.holds = Monitor;
	}

	/**
	 * Deletes a monitor from the store
	 * @param  {Monitor|string} name The monitor object or a string representing the structure this store caches
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
	 * @param  {external:Message} msg The message object from Discord.js
	 */
	run(msg) {
		this.forEach(monit => {
			if (monit.enabled && !(monit.ignoreBots && msg.author.bot) && !(monit.ignoreSelf && this.client.user === msg.author)) monit.run(msg);
		});
	}

	/**
	 * Sets up a monitor in our store.
	 * @param {Monitor} monitor The monitor object we are setting up.
	 * @returns {Monitor}
	 */
	set(monitor) {
		if (!(monitor instanceof this.holds)) return this.client.emit('error', `Only ${this.holds.constructor.name}s may be stored in the Store.`);
		const existing = this.get(monitor.name);
		if (existing) this.delete(existing);
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
