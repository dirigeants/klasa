const { join } = require('path');
const { Collection } = require('discord.js');
const Finalizer = require('./Finalizer');
const Store = require('./interfaces/Store');

/**
 * Stores all finalizers for use in Klasa.
 * @extends external:Collection
 * @implements {Store}
 */
class FinalizerStore extends Collection {

	/**
	 * Constructs our FinalizerStore for use in Klasa
	 * @since 0.0.1
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();

		/**
		 * The client this FinalizerStore was created with.
		 * @since 0.0.1
		 * @name FinalizerStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of finalizers in Klasa relative to where its installed.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'finalizers');

		/**
		 * The directory of local finalizers relative to where you run Klasa from.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'finalizers');

		/**
		 * The type of structure this store holds
		 * @since 0.1.1
		 * @type {Finalizer}
		 */
		this.holds = Finalizer;

		/**
		 * The name of what this holds
		 * @since 0.3.0
		 * @type {String}
		 */
		this.name = 'finalizers';
	}

	/**
	 * Deletes a finalizer from the store
	 * @since 0.0.1
	 * @param  {Finalizer|string} name The finalizer object or a string representing the structure this store caches
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const finalizer = this.resolve(name);
		if (!finalizer) return false;
		super.delete(finalizer.name);
		return true;
	}

	/**
	 * Runs all of our finalizers after a command is ran successfully.
	 * @since 0.0.1
	 * @param  {Array} args An array of arguments passed down from the command
	 * @return {void}
	 */
	run(...args) {
		for (const finalizer of this.values()) if (finalizer.enabled) finalizer.run(...args);
	}

	/**
	 * Sets up a finalizer in our store.
	 * @since 0.0.1
	 * @param {Finalizer} finalizer The finalizer object we are setting up.
	 * @returns {Finalizer}
	 */
	set(finalizer) {
		if (!(finalizer instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(finalizer.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', finalizer);
		super.set(finalizer.name, finalizer);
		return finalizer;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(FinalizerStore);

module.exports = FinalizerStore;
