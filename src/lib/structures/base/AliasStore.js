const { Collection } = require('discord.js');
const Store = require('./Store');

/**
 * The common base for all stores with aliases
 * @see CommandStore
 * @see ArgumentStore
 * @see SerializerStore
 * @extends Store
 */
class AliasStore extends Store {

	constructor(...args) {
		super(...args);

		/**
		 * The different aliases that represent the arguments in this store.
		 * @since 0.5.0
		 * @type external:Collection
		 */
		this.aliases = new Collection();
	}

	/**
	 * Returns an argument in the store if it exists by its name or by an alias.
	 * @since 0.5.0
	 * @param {string} name A argument or alias name
	 * @returns {?Argument}
	 */
	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	/**
	 * Returns a boolean if the argument or alias is found within the store.
	 * @since 0.5.0
	 * @param {string} name A command or alias name
	 * @returns {boolean}
	 */
	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	/**
	 * Sets up an argument in our store.
	 * @since 0.5.0
	 * @param {Argument} piece The command piece we are setting up
	 * @returns {?Argument}
	 */
	set(piece) {
		const argument = super.set(piece);
		if (!argument) return undefined;
		for (const alias of argument.aliases) this.aliases.set(alias, argument);
		return argument;
	}

	/**
	 * Deletes an argument from the store.
	 * @since 0.5.0
	 * @param {Argument|string} name An argument object or a string representing an argument or alias name
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const argument = this.resolve(name);
		if (!argument) return false;
		for (const alias of argument.aliases) this.aliases.delete(alias);
		return super.delete(argument);
	}

	/**
	 * Clears the arguments and aliases from this store
	 * @since 0.5.0
	 * @returns {void}
	 */
	clear() {
		super.clear();
		this.aliases.clear();
	}

}

module.exports = AliasStore;
