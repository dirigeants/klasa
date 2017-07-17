const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Finalizer = require('../structures/Finalizer');

/**
 * Stores all finalizers for use in Klasa
 * @extends external:Collection
 */
class FinalizerStore extends Collection {

	/**
	 * Constructs our FinalizerStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();
		/**
		 * The client this FinalizerStore was created with.
		 * @name FinalizerStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		* The directory of finalizers in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'finalizers');

		/**
		* The directory of local finalizers relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'finalizers');
	}

	/**
	 * Sets up a finalizer in our store.
	 * @param {Finalizer} finalizer The finalizer object we are setting up.
	 * @returns {Finalizer}
	 */
	set(finalizer) {
		if (!(finalizer instanceof Finalizer)) return this.client.emit('error', 'Only finalizers may be stored in the FinalizerStore.');
		const existing = this.get(finalizer.name);
		if (existing) this.delete(existing);
		super.set(finalizer.name, finalizer);
		return finalizer;
	}

	/**
	 * Deletes a finalizer from the store
	 * @param  {Finalizer|string} name The finalizer object or a string representing the finalizer's name
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const finalizer = this.resolve(name);
		if (!finalizer) return false;
		super.delete(finalizer.name);
		return true;
	}

	/**
	 * Initializes all of our finalizers.
	 * @return {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Resolve a string or finalizer into a finalizer object.
	 * @param  {Finalizer|string} name The finalizer object or a string representing a finalizer's name
	 * @return {Finalizer}
	 */
	resolve(name) {
		if (name instanceof Finalizer) return name;
		return this.get(name);
	}

	/**
	 * Loads a finalizer into Klasa so it can be saved in this store.
	 * @param {string} dir The user directory or core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located.
	 * @returns {Finalizer}
	 */
	load(dir, file) {
		const fin = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return fin;
	}

	/**
	 * Loads all of our finalizers from both the user and core directories.
	 * @return {Promise<number>} The number of finalizers loaded.
	 */
	async loadAll() {
		this.clear();
		const coreFiles = await fs.readdir(this.coreDir).catch(() => { fs.ensureDir(this.coreDir).catch(err => this.client.emit('errorlog', err)); });
		if (coreFiles) await Promise.all(coreFiles.map(this.load.bind(this, this.coreDir)));
		const userFiles = await fs.readdir(this.userDir).catch(() => { fs.ensureDir(this.userDir).catch(err => this.client.emit('errorlog', err)); });
		if (userFiles) await Promise.all(userFiles.map(this.load.bind(this, this.userDir)));
		return this.size;
	}

	/**
	 * Runs all of our finalizers after a command is ran successfully.
	 * @param  {Array} args An array of arguments passed down from the command
	 * @return {void}
	 */
	run(...args) {
		this.forEach(finalizer => finalizer.run(...args));
	}

}

module.exports = FinalizerStore;
