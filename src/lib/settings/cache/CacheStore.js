const { Collection } = require('discord.js');

/**
 * The CacheStore that proxies external collections
 * @since 0.5.0
 * @abstract
 * @private
 */
class CacheStore {

	/**
	 * Creates a CacheStore instance
	 * @since 0.5.0
	 * @param {external:Collection} collection The map to proxy
	 */
	constructor(collection = new Collection()) {
		/**
		 * The cached DataStore or Collection to get the data from.
		 * @since 0.5.0
		 * @type {external:Collection}
		 * @private
		 */
		this.collection = collection;
	}

	/**
	 * The get method which gets an entry from the collection.
	 * @since 0.5.0
	 * @param {string|string[]} path The path to retrieve
	 * @returns {SatelliteStore|Settings}
	 * @abstract
	 */
	get() {
		throw new Error(`[CACHESTORE] | Missing method 'get' of ${this.constructor.name}`);
	}

	/**
	 * The has method which checks if an entry exists.
	 * @since 0.5.0
	 * @param {string|string[]} path The path to check
	 * @returns {boolean}
	 * @abstract
	 */
	has() {
		throw new Error(`[CACHESTORE] | Missing method 'has' of ${this.constructor.name}`);
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element contained in this store.
	 * Identical to [Map.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
	 * @since 0.5.0
	 * @yields {string}
	 */
	*keys() {
		for (const settings of this.values()) yield settings.id;
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this store.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @since 0.5.0
	 * @yields {Settings}
	 */
	*values() {
		yield* this.collection.values();
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this store.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @since 0.5.0
	 * @yields {Array<string|Settings>}
	 */
	*entries() {
		for (const settings of this.values()) yield [settings.id, settings];
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this store.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @name @@iterator
	 * @since 0.5.0
	 * @method
	 * @instance
	 * @generator
	 * @returns {Iterator<Array<string|Settings>>}
	 * @memberof CacheStore
	 */

	*[Symbol.iterator]() {
		yield* this.entries();
	}

}

module.exports = CacheStore;
