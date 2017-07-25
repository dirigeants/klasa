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
	 * Runs our monitors on the message.
	 * @param  {external:Message} msg The message object from Discord.js
	 */
	run(msg) {
		this.forEach(monit => {
			if (monit.enabled && !(monit.ignoreBots && msg.author.bot) && !(monit.ignoreSelf && this.client.user === msg.author)) monit.run(msg);
		});
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	delete() {}
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	set() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(MonitorStore);

module.exports = MonitorStore;
