const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Extendable = require('../structures/Extendable');

/**
 * Stores all of our extendables that extend Discord.js
 * @extends external:Collection
 */
class ExtendableStore extends Collection {

	/**
	 * Constructs our ExtendableStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();
		/**
		 * The client this ExtendableStore was created with.
		 * @name ExtendableStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		* The directory of extendables in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'extendables');

		/**
		* The directory of local extendables relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'extendables');
	}

	/**
	 * Sets up an extendable in our store.
	 * @param {Extendable} extendable The extendable object we are setting up.
	 * @returns {Extendable}
	 */
	set(extendable) {
		if (!(extendable instanceof Extendable)) return this.client.emit('error', 'Only extendables may be stored in the ExtendableStore.');
		extendable.init();
		super.set(extendable.name, extendable);
		return extendable;
	}

	/**
	 * Initializes all of our extendables.
	 * @return {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Resolves a string or extendable into a extendable object
	 * @param  {Extendable|string} name The extendable object or a string representing the name of the extendable
	 * @return {Extendable}
	 */
	resolve(name) {
		if (name instanceof Extendable) return name;
		return this.get(name);
	}

	/**
	 * Loads all of our extendables from both the user and core directories.
	 * @param  {string} dir  The user directory or core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located
	 * @return {Extendable}
	 */
	load(dir, file) {
		const extend = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return extend;
	}

	/**
	 * Loads all of our extends from both the user and core directories.
	 * @return {Promise<number>} The number of extendables loaded.
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

module.exports = ExtendableStore;
