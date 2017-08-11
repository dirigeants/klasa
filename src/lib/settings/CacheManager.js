/**
 * Manages the local cache
 */
class CacheManager {

	/**
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		/**
		 * The provider SettingGateway will use to store the cache.
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'cacheEngine', { value: client.config.provider.cache || 'js' });

		/**
		 * The data stored for this SettingGateway instance.
		 */
		this.data = this.cacheEngine === 'js' ? new client.methods.Collection() : client.providers.get(this.cacheEngine);
	}

	/**
	 * Get the data from the cache by its ID.
	 * @param {string} key The key to search for.
	 * @returns {Object}
	 */
	get(key) {
		if (this.cacheEngine === 'js') return this.data.get(key);
		return this.data.get(this.type, key);
	}

	/**
	 * Get all the data from the cache as an array of objects.
	 * @returns {Object[]}
	 */
	getAll() {
		if (this.cacheEngine === 'js') return this.data;
		return this.data.getAll(this.type);
	}

	/**
	 * Save a new data to the cache.
	 * @param {string} key The data's key.
	 * @param {Object} value The data's value.
	 * @returns {any}
	 */
	set(key, value) {
		if (this.cacheEngine === 'js') return this.data.set(key, value);
		return this.data.set(this.type, key, value);
	}

	/**
	 * Delete the selected data from the cache by its ID.
	 * @param {string} key The data's key.
	 * @returns {any}
	 */
	delete(key) {
		if (this.cacheEngine === 'js') return this.data.delete(key);
		return this.data.delete(this.type, key);
	}

}

module.exports = CacheManager;
