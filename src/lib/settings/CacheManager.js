/**
 * Manages the local cache
 */
class CacheManager {

	/**
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		this.cacheEngine = client.config.provider.cache || 'js';
		this.data = this.cacheEngine === 'js' ? new client.methods.Collection() : client.providers.get(this.cacheEngine);
	}

	/**
	 * Gets a guild from cache
	 * @param {string} guild The guild id
	 * @returns {Object} The guild setting object
	 */
	get(guild) {
		if (this.cacheEngine === 'js') return this.data.get(guild);
		return this.data.get('guilds', guild);
	}

	/**
	 * Gets all guilds from cache
	 * @returns {Object[]} All guild setting objects
	 */
	getAll() {
		if (this.cacheEngine === 'js') return this.data;
		return this.data.getAll('guilds');
	}

	/**
	 * Sets a guild setting object to cache
	 * @param {string} guild The guild id
	 * @param {Object} data The guild setting object
	 * @returns {void}
	 */
	set(guild, data) {
		if (this.cacheEngine === 'js') return this.data.set(guild, data);
		return this.data.set('guilds', guild, data);
	}

	/**
	 * Deletes a guild from cache
	 * @param {string} guild The guild id
	 * @returns {void}
	 */
	delete(guild) {
		if (this.cacheEngine === 'js') return this.data.delete(guild);
		return this.data.delete('guilds', guild);
	}

}

module.exports = CacheManager;
