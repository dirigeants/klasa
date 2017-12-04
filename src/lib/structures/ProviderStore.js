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
	 * @since 0.0.1
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();

		/**
		 * The client this ProviderStore was created with.
		 * @since 0.0.1
		 * @name ProviderStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The directory of providers in Klasa relative to where its installed.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'providers');

		/**
		 * The directory of local providers relative to where you run Klasa from.
		 * @since 0.0.1
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'providers');

		/**
		 * The type of structure this store holds
		 * @since 0.1.1
		 * @type {Provider}
		 */
		this.holds = Provider;

		/**
		 * The name of what this holds
		 * @since 0.3.0
		 * @type {String}
		 */
		this.name = 'providers';
	}

	/**
	 * Deletes a provider from the store
	 * @since 0.0.1
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
	 * @since 0.0.1
	 * @param {Provider} provider The provider object we are setting up.
	 * @returns {Provider}
	 */
	set(provider) {
		if (!(provider instanceof this.holds)) return this.client.emit('error', `Only ${this.name} may be stored in the Store.`);
		const existing = this.get(provider.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', provider);
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
