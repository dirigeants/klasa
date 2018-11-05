const GatewayStorage = require('./GatewayStorage');
const Settings = require('../Settings');
const { Collection } = require('discord.js');

/**
 * <danger>You should never create a Gateway instance by yourself.
 * Please check {@link UnderstandingSettingsGateway} about how to construct your own Gateway.</danger>
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class Gateway extends GatewayStorage {

	/**
	 * @since 0.0.1
	 * @param {GatewayDriver} store The GatewayDriver instance which initiated this instance
	 * @param {string} name The name of this Gateway
	 * @param {Schema} schema The schema for this gateway
	 * @param {string} provider The provider's name for this gateway
	 */
	constructor(store, name, schema, provider) {
		super(store.client, name, schema, provider);

		/**
		 * The GatewayDriver that manages this Gateway
		 * @since 0.0.1
		 * @type {GatewayDriver}
		 */
		this.store = store;

		/**
		 * The cached entries for this Gateway or the external datastore to get the settings from
		 * @since 0.0.1
		 * @type {external:Collection<string, Settings>|external:DataStore}
		 */
		this.cache = (name in this.client) && this.client[name] instanceof Map ? this.client[name] : new Collection();

		/**
		 * The synchronization queue for all Settings instances
		 * @since 0.5.0
		 * @type {WeakMap<string, Promise<Settings>>}
		 */
		this.syncMap = new WeakMap();

		/**
		 * @since 0.5.0
		 * @type {boolean}
		 * @private
		 */
		Object.defineProperty(this, '_synced', { value: false, writable: true });
	}

	/**
	 * The Settings that this class should make.
	 * @since 0.5.0
	 * @type {Settings}
	 * @readonly
	 * @private
	 */
	get Settings() {
		return Settings;
	}

	/**
	 * Gets an entry from the cache or creates one if it does not exist
	 * @since 0.5.0
	 * @param {*} target The target that holds a Settings instance of the holder for the new one
	 * @param {string|number} [id = target.id] The settings' identificator
	 * @returns {Settings}
	 */
	acquire(target, id = target.id) {
		return this.get(id) || this.create(target, id);
	}

	/**
	 * Get an entry from the cache.
	 * @since 0.5.0
	 * @param {string|number} id The key to get from the cache
	 * @returns {?Settings}
	 */
	get(id) {
		const entry = this.cache.get(id);
		return (entry && entry.settings) || null;
	}

	/**
	 * Create a new Settings instance for this gateway.
	 * @since 0.5.0
	 * @param {*} target The target that will hold this instance alive
	 * @param {string|number} [id = target.id] The settings' identificator
	 * @returns {Settings}
	 */
	create(target, id = target.id) {
		const settings = new this.Settings(this, target, id);
		if (this._synced && this.schema.size) settings.sync(true).catch(err => this.client.emit('error', err));
		return settings;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Array<string>|string)} [input=Array<string>] An object containing a id property, like discord.js objects, or a string
	 * @returns {?(Gateway|Settings)}
	 */
	async sync(input) {
		// If the schema is empty, there's no point on running any operation
		if (!this.schema.size) return this;
		if (typeof input === 'undefined') input = [...this.cache.keys()];
		if (Array.isArray(input)) {
			this._synced = true;
			const entries = await this.provider.getAll(this.name, input);
			for (const entry of entries) {
				if (!entry) continue;
				const cache = this.get(entry.id);
				if (cache) {
					cache.existenceStatus = true;
					cache._patch(entry);
				}
			}

			// Set all the remaining settings from unknown status in DB to not exists.
			for (const entry of this.cache.values()) {
				if (entry.settings.existenceStatus === null) entry.settings.existenceStatus = false;
			}
			return this;
		}

		const cache = this.get((input && input.id) || input);
		return cache ? cache.sync(true) : null;
	}

}

module.exports = Gateway;
