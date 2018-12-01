const { Dataset, Type } = require('klasa');

module.exports = class extends Dataset {

	constructor(...args) {
		super(...args, { default: new Map() });
	}

	/**
	 * Set a value
	 * @param {Map} value The value to set
	 * @returns {Map}
	 */
	set(value) {
		if (value instanceof Map) return value;
		throw new TypeError(`Expected a Map instance, got ${new Type(value)}`);
	}

	/**
	 * Add a value to the map
	 * @param {Map} map The map to add the data to
	 * @param {Array<string[]>} value The value to add to the map
	 * @returns {Map}
	 */
	add(map, [key, value]) {
		map.set(key, value);
		return map;
	}

	/**
	 * Remove a value from the map
	 * @param {Map} map The map to remove the data from
	 * @param {*} key The key to remove from the map
	 * @returns {Map}
	 */
	remove(map, key) {
		map.remove(key);
		return map;
	}

	/**
	 * Resolve a map
	 * @since 0.5.0
	 * @param {Map} map The map to serialize
	 * @param {SchemaPiece} schemaPiece The SchemaPiece instance that provides context
	 * @param {Language} language The language instance for i18n messages
	 * @param {KlasaGuild} [guild] The guild for context
	 * @returns {Promise<Array>}
	 */
	async deserialize(map, schemaPiece, language, guild) {
		const { serializer } = schemaPiece;
		return new Map((await Promise.all([...this.set(map)]
			.map(([key, value]) => serializer.deserialize(value, schemaPiece, language, guild)
				.then((res) => [key, res])
				.catch(() => null)
			))).filter(entry => entry !== null));
	}

	/**
	 * Serialize a value
	 * @since 0.5.0
	 * @param {Map} map The map to serialize
	 * @returns {*}
	 */
	serialize(map) {
		return [...map];
	}

};
