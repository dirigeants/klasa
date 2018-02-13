const { extname, relative, sep } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const Command = require('./Command');
const Store = require('./interfaces/Store');

/**
 * Stores all the commands usable in Klasa
 * @extends external:Collection
 * @implements {Store}
 */
class CommandStore extends Store {

	/**
	 * Constructs our CommandStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client, 'commands', Command);

		/**
		 * The different aliases that represent the commands in this store.
		 * @since 0.0.1
		 * @type external:Collection
		 */
		this.aliases = new Collection();
	}

	/**
	 * Returns a command in the store if it exists by its name or by an alias.
	 * @since 0.0.1
	 * @param {string} name A command or alias name
	 * @returns {Command}
	 */
	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	/**
	 * Returns a boolean if the command or alias is found within the store.
	 * @since 0.0.1
	 * @param {string} name A command or alias name
	 * @returns {boolean}
	 */
	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	/**
	 * Sets up a command in our store.
	 * @since 0.0.1
	 * @param {Command} command The command object we are setting up
	 * @returns {Command}
	 */
	set(command) {
		if (!(command instanceof Command)) return this.client.emit('error', 'Only commands may be stored in the CommandStore.');
		const existing = this.get(command.name);
		if (existing) this.delete(existing);
		else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', command);
		super.set(command.name, command);
		for (const alias of command.aliases) this.aliases.set(alias, command);
		return command;
	}

	/**
	 * Deletes a command from the store.
	 * @since 0.0.1
	 * @param {Command|string} name A command object or a string representing a command or alias name
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const command = this.resolve(name);
		if (!command) return false;
		super.delete(command.name);
		for (const alias of command.aliases) this.aliases.delete(alias);
		return true;
	}

	/**
	 * Clears the commands and aliases from this store
	 * @since 0.0.1
	 * @returns {void}
	 */
	clear() {
		super.clear();
		this.aliases.clear();
	}

	/**
	 * Loads all of our commands from both the user and core directories.
	 * @since 0.0.1
	 * @returns {number} The number of commands and aliases loaded.
	 */
	async loadAll() {
		this.clear();
		await CommandStore.walk(this, true);
		await CommandStore.walk(this);
		return this.size;
	}

	/**
	 * Walks our directory of commands for the user and core directories.
	 * @since 0.0.1
	 * @param {CommandStore} store The command store we're loading into
	 * @param {boolean} [core=false] If the file is located in the core directory or not
	 * @returns {void}
	 */
	static async walk(store, core = false) {
		const dir = core ? store.coreDir : store.userDir;
		const files = await fs.scan(dir, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' }).catch(() => { fs.ensureDir(dir).catch(err => store.client.emit('error', err)); });
		if (!files) return true;

		return Promise.all(Array.from(files.keys()).map(file => store.load(relative(dir, file).split(sep), core)));
	}

}

Store.applyToClass(CommandStore, ['loadAll']);

module.exports = CommandStore;
