const GatewayStorage = require('./GatewayStorage');
const Settings = require('../Settings');
const { Collection } = require('discord.js');
const { RequestHandler } = require('@klasa/request-handler');

/**
 * The Gateway class for persistent data interaction with a cache layer
 * @extends GatewayStorage
 */
class Gateway extends GatewayStorage {

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The KlasaClient instance which initiated this instance
	 * @param {string} name The name of this Gateway
	 * @param {GatewayOptions} [options = {}] The options for this gateway
	 */
	constructor(client, name, options) {
		super(client, name, options);

		/**
		 * The cached entries for this Gateway or the external datastore to get the settings from
		 * @since 0.0.1
		 * @type {external:Collection<string, Settings>|external:DataStore}
		 */
		this.cache = (name in this.client) && this.client[name] instanceof Map ? this.client[name] : new Collection();

		/**
		 * The request handler that manages the synchronization queue
		 * @since 0.5.0
		 * @type {RequestHandler<string, *>}
		 * @protected
		 */
		this.requestHandler = new RequestHandler(id => this.provider.get(this.name, id), ids => this.provider.getAll(this.name, ids));
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
		const settings = new Settings(this, target, id);
		if (this.schema.size !== 0) settings.sync(true).catch(err => this.client.emit('error', err));
		return settings;
	}

	/**
	 * Runs a synchronization task for the gateway.
	 * @since 0.5.0
	 * @returns {this}
	 */
	async sync() {
		await this.requestHandler.wait();
		return this;
	}

}

module.exports = Gateway;
