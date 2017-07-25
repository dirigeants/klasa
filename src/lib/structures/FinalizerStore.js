const { join } = require('path');
const { Collection } = require('discord.js');
const Finalizer = require('./Finalizer');
const Store = require('./interfaces/Store');

/**
 * Stores all finalizers for use in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class FinalizerStore extends Collection {

	/**
	 * Constructs our FinalizerStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();
		/**
		 * The client this FinalizerStore was created with.
		 * @name FinalizerStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of finalizers in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'finalizers');

		/**
		 * The directory of local finalizers relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'finalizers');

		/**
		 * The type of structure this store holds
		 * @type {Finalizer}
		 */
		this.holds = Finalizer;
	}


	/**
	 * Runs all of our finalizers after a command is ran successfully.
	 * @param  {Array} args An array of arguments passed down from the command
	 * @return {void}
	 */
	run(...args) {
		this.forEach(finalizer => {
			if (finalizer.enabled) finalizer.run(...args);
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

Store.applyToClass(FinalizerStore);

module.exports = FinalizerStore;
