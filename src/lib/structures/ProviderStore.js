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

Store.applyToClass(ProviderStore);

module.exports = ProviderStore;
