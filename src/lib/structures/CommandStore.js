const { Collection } = require('discord.js');
const Command = require('./Command');
const Store = require('./base/Store');

/**
 * Stores all the commands usable in Klasa
 * @extends external:Collection
 * @extends {Store}
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
	 * @returns {?Command}
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
	 * @param {Command} piece The command piece we are setting up
	 * @returns {?Command}
	 */
	set(piece) {
		const command = super.set(piece);
		if (!command) return undefined;
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
		for (const alias of command.aliases) this.aliases.delete(alias);
		return super.delete(command);
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

}

module.exports = CommandStore;
