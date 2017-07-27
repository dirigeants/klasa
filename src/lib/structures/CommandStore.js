const { resolve, join } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Command = require('./Command');
const Store = require('./interfaces/Store');

/**
 * Stores all the commands usable in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class CommandStore extends Collection {

	/**
	 * Constructs our CommandStore for use in Klasa
	 * @param {KlasaClient} client The Klasa Client
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
		 * The different aliases that represent the commands in this store.
		 * @type external:Collection
		 */
		this.aliases = new Collection();

		/**
		 * The directory of commands in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'commands');

		/**
		 * The directory of local commands relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'commands');

		/**
		 * The type of structure this store holds
		 * @type {Command}
		 */
		this.holds = Command;
	}

	/**
	 * The specific command information needed to make our help command.
	 * @type {Array<Object>}
	 * @readonly
	 */
	get help() {
		return this.map(command => ({ name: command.name, usage: command.parsedUsage.fullUsage, description: command.description }));
	}

	/**
	 * Returns a command in the store if it exists by its name or by an alias.
	 * @param {string} name A command or alias name.
	 * @returns {Command}
	 */
	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	/** Returns a boolean if the command or alias is found within the store.
	 * @param {string} name A command or alias name
	 * @returns {boolean}
	 */
	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	/**
	 * Sets up a command in our store.
	 * @param {Command} command The command object we are setting up.
	 * @returns {Command}
	 */
	set(command) {
		if (!(command instanceof Command)) return this.client.emit('error', 'Only commands may be stored in the CommandStore.');
		const existing = this.get(command.name);
		if (existing) this.delete(existing);
		super.set(command.name, command);
		command.aliases.forEach(alias => this.aliases.set(alias, command));
		return command;
	}

	/**
	 * Deletes a command from the store.
	 * @param {Command|string} name A command object or a string representing a command or alias name.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const command = this.resolve(name);
		if (!command) return false;
		super.delete(command.name);
		command.aliases.forEach(alias => this.aliases.delete(alias));
		return true;
	}

	/**
	 * Clears the commands and aliases from this store
	 * @returns {void}
	 */
	clear() {
		super.clear();
		this.aliases.clear();
	}

	/**
	 * Loads a command file into Klasa so it can saved in this store.
	 * @param {string} dir The user directory or core directory where this file is saved.
	 * @param {Array} file An array containing information about it's category structure.
	 * @returns {Command}
	 */
	load(dir, file) {
		const cmd = this.set(new (require(join(dir, ...file)))(this.client, dir, file));
		delete require.cache[join(dir, ...file)];
		return cmd;
	}

	/**
	 * Loads all of our commands from both the user and core directories.
	 * @returns {Promise<number[]>} The number of commands and aliases loaded.
	 */
	async loadAll() {
		this.clear();
		await CommandStore.walk(this, this.coreDir);
		await CommandStore.walk(this, this.userDir);
		return [this.size, this.aliases.size];
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	resolve() {}
	/* eslint-enable no-empty-function */

	/**
	 * Walks our directory of commands for the user and core directories.
	 * @param {CommandStore} store The command store we're loading into.
	 * @param {string} dir The directory of commands we're using to load commands from.
	 * @returns {void}
	 */
	static async walk(store, dir) {
		const files = await fs.readdir(dir).catch(() => { fs.ensureDir(dir).catch(err => store.client.emit('errorlog', err)); });
		if (!files) return false;
		files.filter(file => file.endsWith('.js')).map(file => store.load(dir, [file]));
		const subfolders = [];
		const mps1 = files.filter(file => !file.includes('.')).map(async (folder) => {
			const subFiles = await fs.readdir(resolve(dir, folder));
			if (!subFiles) return true;
			subFiles.filter(file => !file.includes('.')).forEach(subfolder => subfolders.push({ folder: folder, subfolder: subfolder }));
			return subFiles.filter(file => file.endsWith('.js')).map(file => store.load(dir, [folder, file]));
		});
		await Promise.all(mps1).catch(err => { throw err; });
		const mps2 = subfolders.map(async (subfolder) => {
			const subSubFiles = await fs.readdir(resolve(dir, subfolder.folder, subfolder.subfolder));
			if (!subSubFiles) return true;
			return subSubFiles.filter(file => file.endsWith('.js')).map(file => store.load(dir, [subfolder.folder, subfolder.subfolder, file]));
		});
		return Promise.all(mps2).catch(err => { throw err; });
	}

}

Store.applyToClass(CommandStore, ['load', 'loadAll']);

module.exports = CommandStore;
