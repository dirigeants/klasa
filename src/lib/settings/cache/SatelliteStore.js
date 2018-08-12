const CacheStore = require('./CacheStore');

class SatelliteStore extends CacheStore {

	/**
	 * The get method which gets an entry from the collection.
	 * @since 0.5.0
	 * @param {string|string[]} path The path to retrieve
	 * @returns {SatelliteStore|Settings}
	 */
	get(path) {
		const [key, ...rest] = typeof path === 'string' ? path.split('.') : path;
		const entry = this.collection.get(key);
		return entry && (rest.length ? entry.satellite.get(rest) : entry.satellite);
	}

	/**
	 * The has method which checks if an entry exists.
	 * @since 0.5.0
	 * @param {string|string[]} path The path to check
	 * @returns {boolean}
	 */
	has(path) {
		return Boolean(this.get(path));
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this store.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @since 0.5.0
	 * @yields {Settings}
	 */
	*values() {
		for (const value of this.collection.values()) yield* value.satellite.values();
	}

}

module.exports = SatelliteStore;
