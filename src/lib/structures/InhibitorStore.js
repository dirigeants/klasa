const { join } = require('path');
const { Collection } = require('discord.js');
const Inhibitor = require('./Inhibitor');
const Store = require('./interfaces/Store');

/**
 * Stores all the inhibitors in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class InhibitorStore extends Collection {

	/**
	 * Constructs our InhibitorStore for use in Klasa
	 * @since 0.0.1
	 * @param  {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super();

		/**
		 * The client this InhibitorStore was created with.
		 * @since 0.0.1
		 * @name InhibitorStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of inhibitors in Klasa relative to where its installed.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'inhibitors');

		/**
		 * The directory of local inhibitors relative to where you run Klasa from.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'inhibitors');

		/**
		 * The type of structure this store holds
		 * @since 0.1.1
		 * @type {Inhibitor}
		 */
		this.holds = Inhibitor;

		/**
		 * The name of what this holds
		 * @since 0.3.0
		 * @type {String}
		 */
		this.name = 'inhibitors';
	}

	/**
	 * Deletes a inhibitor from the store
	 * @since 0.0.1
	 * @param  {Inhibitor|string} name The inhibitor object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const inhibitor = this.resolve(name);
		if (!inhibitor) return false;
		super.delete(inhibitor.name);
		return true;
	}

	/**
	 * Runs our inhibitors on the command.
	 * @since 0.0.1
	 * @param  {external:Message} msg The message object from Discord.js
	 * @param  {Command} cmd The command being ran.
	 * @param  {boolean} [selective=false] Whether or not we should ignore certain inhibitors to prevent spam.
	 * @returns {void}
	 */
	async run(msg, cmd, selective = false) {
		const mps = [];
		for (const inhibitor of this.values()) if (inhibitor.enabled && (!selective || !inhibitor.spamProtection)) mps.push(inhibitor.run(msg, cmd).catch(err => err));
		const results = (await Promise.all(mps)).filter(res => res);
		if (results.includes(true)) throw undefined;
		if (results.length > 0) throw results.join('\n');
		return undefined;
	}

	/**
	 * Sets up a inhibitor in our store.
	 * @since 0.0.1
	 * @param {Inhibitor} inhibitor The inhibitor object we are setting up.
	 * @returns {Inhibitor}
	 */
	set(inhibitor) {
		if (!(inhibitor instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(inhibitor.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', inhibitor);
		super.set(inhibitor.name, inhibitor);
		return inhibitor;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(InhibitorStore);

module.exports = InhibitorStore;
