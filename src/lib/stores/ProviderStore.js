const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Provider = require('../structures/Provider');

/**
 * Stores all providers for use in Klasa
 * @extends external:Collection
 */
class ProviderStore extends Collection {

	/**
	 * Constructs our ProviderStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();
		/**
		 * The client this CommandStore was created with.
		 * @name CommandStore#client
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
	}

	/**
	 * Sets up a provider in our store.
	 * @param {Provider} provider The provider object we are setting up.
	 * @returns {Provider}
	 */
	set(provider) {
		if (!(provider instanceof Provider)) return this.client.emit('error', 'Only providers may be stored in the ProviderStore.');
		const existing = this.get(provider.name);
		if (existing) this.delete(existing);
		super.set(provider.name, provider);
		return provider;
	}

	/**
	 * Deletes a provider from the store.
	 * @param {Provider|string} name A provider object or a string representing a provider.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const provider = this.resolve(name);
		if (!provider) return false;
		super.delete(provider.name);
		return true;
	}

	/**
	 * Initializes all of our providers
	 * @returns {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Resolve a string or provider into a provider object.
	 * @param {Provider|string} name The providere object or a string representing a provider.
	 * @returns {Provider}
	 */
	resolve(name) {
		if (name instanceof Provider) return name;
		return this.get(name);
	}

	/**
	 * Loads an provider into Klasa so it can be saved in this store.
	 * @param  {string} dir  The user directory or the core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located.
	 * @return {Provider}
	 */
	load(dir, file) {
		const pro = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return pro;
	}

	/**
	 * Loads all of our providers from both the user and core directories.
	 * @return {Promise<number>} The number of providers loaded into this store.
	 */
	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

}

module.exports = ProviderStore;
