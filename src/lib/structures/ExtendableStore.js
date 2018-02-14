const Extendable = require('./Extendable');
const Store = require('./base/Store');

/**
 * Stores all of our extendables that extend Discord.js
 * @extends Store
 */
class ExtendableStore extends Store {

	/**
	 * Constructs our ExtendableStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super(client, 'extendables', Extendable);
	}

	/**
	 * Deletes an extendable from the store.
	 * @since 0.0.1
	 * @param {Extendable|string} name A extendable object or a string representing a command or alias name
	 * @returns {boolean}
	 */
	delete(name) {
		const extendable = this.resolve(name);
		if (!extendable) return false;
		for (const structure of extendable.appliesTo) delete extendable.target[structure].prototype[this.name];
		super.delete(extendable.name);
		return true;
	}

	/**
	 * Clears the extendable from the store and removes the extensions.
	 * @since 0.0.1
	 */
	clear() {
		for (const extendable of this.keys()) this.delete(extendable);
	}

	/**
	 * Sets up an extendable in our store.
	 * @since 0.0.1
	 * @param {Extendable} extendable The extendable object we are setting up
	 * @returns {Extendable}
	 */
	set(extendable) {
		if (!(extendable instanceof Extendable)) return this.client.emit('error', 'Only extendables may be stored in the ExtendableStore.');
		extendable.init();
		if (!this.has(extendable.name) && this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', extendable);
		super.set(extendable.name, extendable);
		return extendable;
	}

}

module.exports = ExtendableStore;
