const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Monitor = require('../structures/Monitor');

/**
 * Stores all monitors for use in Klasa
 * @extends external:Collection
 */
class MonitorStore extends Collection {

	/**
	 * Constructs our MonitorStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super();
		/**
		 * The client this MonitorStore was created with.
		 * @name MonitorStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		* The directory of monitors in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'monitors');

		/**
		* The directory of local monitors relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'monitors');
	}

	/**
	 * Sets up a monitors in our store.
	 * @param {Monitor} monitor The monitors object we are setting up.
	 * @returns {Monitor}
	 */
	set(monitor) {
		if (!(monitor instanceof Monitor)) return this.client.emit('error', 'Only monitors may be stored in the MonitorStore.');
		const existing = this.get(monitor.name);
		if (existing) this.delete(existing);
		super.set(monitor.name, monitor);
		return monitor;
	}

	/**
	 * Deletes a monitor from the store.
	 * @param {Monitor|string} name A monitor object or a string representing a monitor.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const monitor = this.resolve(name);
		if (!monitor) return false;
		super.delete(monitor.name);
		return true;
	}

	/**
	 * Initializes all of our monitors
	 * @returns {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Resolve a string or monitor into a monitor object.
	 * @param {Monitor|string} name The monitor object or a string representing a monitor.
	 * @returns {Monitor}
	 */
	resolve(name) {
		if (name instanceof Monitor) return name;
		return this.get(name);
	}

	/**
	 * Loads an monitor into Klasa so it can be saved in this store.
	 * @param  {string} dir  The user directory or the core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located.
	 * @return {Monitor}
	 */
	load(dir, file) {
		const mon = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return mon;
	}

	/**
	 * Loads all of our monitors from both the user and core directories.
	 * @return {Promise<number>} The number of monitors loaded into this store.
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
	 * Runs our monitors on the message.
	 * @param  {external:Message} msg The message object from Discord.js
	 */
	run(msg) {
		this.forEach(monit => {
			if (monit.enabled && !(monit.ignoreBots && msg.author.bot) && !(monit.ignoreSelf && this.client.user === msg.author)) monit.run(msg);
		});
	}

}

module.exports = MonitorStore;
