const { Collection } = require('discord.js');
const Serializer = require('./Serializer');
const Store = require('./base/Store');

/**
 * Stores all the serializers usable in Klasa
 * @extends Store
 */
class SerializerStore extends Store {

	/**
	 * Constructs our SerializerStore for use in Klasa
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client, 'serializers', Serializer);

		/**
		 * The different aliases that represent the serializers in this store.
		 * @since 0.5.0
		 * @type external:Collection
		 */
		this.aliases = new Collection();
	}

	/**
	 * Returns an serializer in the store if it exists by its name or by an alias.
	 * @since 0.5.0
	 * @param {string} name A serializer or alias name
	 * @returns {?Serializer}
	 */
	get(name) {
		return super.get(name) || this.aliases.get(name);
	}

	/**
	 * Returns a boolean if the serializer or alias is found within the store.
	 * @since 0.5.0
	 * @param {string} name A command or alias name
	 * @returns {boolean}
	 */
	has(name) {
		return super.has(name) || this.aliases.has(name);
	}

	/**
	 * Sets up an serializer in our store.
	 * @since 0.5.0
	 * @param {Serializer} piece The command piece we are setting up
	 * @returns {?Serializer}
	 */
	set(piece) {
		const serializer = super.set(piece);
		if (!serializer) return undefined;
		for (const alias of serializer.aliases) this.aliases.set(alias, serializer);
		return serializer;
	}

	/**
	 * Deletes an serializer from the store.
	 * @since 0.5.0
	 * @param {Serializer|string} name An serializer object or a string representing an serializer or alias name
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const serializer = this.resolve(name);
		if (!serializer) return false;
		for (const alias of serializer.aliases) this.aliases.delete(alias);
		return super.delete(serializer);
	}

	/**
	 * Clears the serializer and aliases from this store
	 * @since 0.5.0
	 * @returns {void}
	 */
	clear() {
		super.clear();
		this.aliases.clear();
	}

}

module.exports = SerializerStore;
