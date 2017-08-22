const { join } = require('path');
const { Collection } = require('discord.js');
const Provider = require('./Provider');
const Store = require('./interfaces/Store');

/**
 * Stores all providers for use in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class ProviderStore extends Collection {

	/**
	 * Constructs our ProviderStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();
		/**
		 * The client this ProviderStore was created with.
		 * @name ProviderStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		* The directory of providers in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'providers');

		/**
		* The directory of local providers relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'providers');

		/**
		 * The type of structure this store holds
		 * @type {Provider}
		 */
		this.holds = Provider;

		/**
		 * The name of what this holds
		 * @type {String}
		 */
		this.name = 'providers';
	}

	/**
	 * Deletes a provider from the store
	 * @param  {Provider|string} name The provider object or a string representing the structure this store caches
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const pro = this.resolve(name);
		if (!pro) return false;
		pro.shutdown();
		super.delete(pro.name);
		return true;
	}

	/**
	 * Sets up a provider in our store.
	 * @param {Provider} provider The provider object we are setting up.
	 * @returns {Provider}
	 */
	set(provider) {
		if (!(provider instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(provider.name);
		if (existing) this.delete(existing);
		super.set(provider.name, provider);
		return provider;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(ProviderStore);

module.exports = ProviderStore;
