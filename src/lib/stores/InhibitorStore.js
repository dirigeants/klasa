const { join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Inhibitor = require('../structures/Inhibitor');

/**
 * Stores all the inhibitors in Klasa
 * @textends external:Collection
 */
class InhibitorStore extends Collection {

	/**
	 * Constructs our InhibitorStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa Client
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
		 * The directory of inhibitors in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'inhibitors');

		/**
		 * The directory of local inhibitors relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'inhibitors');
	}

	/**
	 * Sets up an inhibitor in our store.
	 * @param {Inhibitor} inhibitor The inhibitor object we are setting up
	 * @returns {Inhibitor}
	 */
	set(inhibitor) {
		if (!(inhibitor instanceof Inhibitor)) return this.client.emit('error', 'Only inhibitors may be stored in the InhibitorStore.');
		const existing = this.get(inhibitor.name);
		if (existing) this.delete(existing);
		super.set(inhibitor.name, inhibitor);
		return inhibitor;
	}

	/**
	 * Deletes an inhibitor from the store.
	 * @param  {Inhibitor|string} name An inhibitor object or a string representing the inhibitor name
	 * @return {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const inhibitor = this.resolve(name);
		if (!inhibitor) return false;
		super.delete(inhibitor.name);
		return true;
	}

	/**
	 * Initializes all of our inhibitors.
	 * @returns {Promise<Array>}
	 */
	init() {
		return Promise.all(this.map(piece => piece.init()));
	}

	/**
	 * Resolve a string or inhibitor into a inhibitor object.
	 * @param {Inhibitor|string} name The inhibitor object or a string representing a inhibitor name or alias.
	 * @returns {Inhibitor}
	 */
	resolve(name) {
		if (name instanceof Inhibitor) return name;
		return this.get(name);
	}

	/**
	 * Loads an event into Klasa so it can be saved in this store.
	 * @param  {string} dir  The user directory or the core directory where this file is saved.
	 * @param  {string} file A string showing where the file is located.
	 * @return {Inhibitor}
	 */
	load(dir, file) {
		const inh = this.set(new (require(join(dir, file)))(this.client, dir, file));
		delete require.cache[join(dir, file)];
		return inh;
	}


		/**
		 * Loads all of our inhibitors from both the user and core directories.
		 * @returns {Promise<number>} The number of inhibitors loaded.
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
	 * Runs our inhibitors on the command.
	 * @param  {Message} msg The message object from Discord.js
	 * @param  {Command} cmd The command being ran.
	 * @param  {boolean} [selective=false] Whether or not we should ignore certain inhibitors to prevent spam.
	 * @return {Promise<number>}
	 */
	async run(msg, cmd, selective = false) {
		const mps = [true];
		let i = 1;
		let usage;
		this.forEach((mProc, key) => {
			if (key === 'usage') usage = i;
			if (!mProc.spamProtection && !selective) mps.push(mProc.run(msg, cmd));
			i++;
		});
		return Promise.all(mps).then(value => value[usage]);
	}

}

module.exports = InhibitorStore;
