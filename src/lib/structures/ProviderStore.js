const Provider = require('./Provider');
const Store = require('./base/Store');

/**
 * Stores all providers for use in Klasa
 * @extends Store
 */
class ProviderStore extends Store {

	/**
	 * Constructs our ProviderStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'providers', Provider);
	}

	/**
	 * The default provider set in KlasaClientOptions.providers
	 * @since 0.5.0
	 * @type {Provider}
	 * @readonly
	 */
	get default() {
		return this.get(this.client.options.providers.default);
	}

	/**
	 * Deletes a provider from the store
	 * @since 0.0.1
	 * @param {Provider|string} name The provider object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
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
	 * @param {Provider} provider The provider object we are setting up
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

}

module.exports = ProviderStore;
