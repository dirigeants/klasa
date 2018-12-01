const { Dataset, Type } = require('klasa');

module.exports = class extends Dataset {

	constructor(...args) {
		super(...args, { default: new Set() });
	}

	/**
	 * Set a value
	 * @param {Set} value The value to set
	 * @returns {Set}
	 */
	set(value) {
		if (value instanceof Set) return value;
		throw new TypeError(`Expected a Set instance, got ${new Type(value)}`);
	}

	/**
	 * Add a value to the set
	 * @param {Set} set The set to add the data to
	 * @param {*} value The value to add to the set
	 * @returns {Set}
	 */
	add(set, value) {
		set.add(value);
		return set;
	}

	/**
	 * Remove a value from the set
	 * @param {Set} set The set to remove the data from
	 * @param {*} value The value to remove from the set
	 * @returns {Set}
	 */
	remove(set, value) {
		set.remove(value);
		return set;
	}

	/**
	 * Resolve a set
	 * @since 0.5.0
	 * @param {Set} set The set to serialize
	 * @param {SchemaPiece} schemaPiece The SchemaPiece instance that provides context
	 * @param {Language} language The language instance for i18n messages
	 * @param {KlasaGuild} [guild] The guild for context
	 * @returns {Promise<Array>}
	 */
	async deserialize(set, schemaPiece, language, guild) {
		const { serializer } = schemaPiece;
		return (await Promise.all([...this.set(set)].map(value => serializer.deserialize(value, schemaPiece, language, guild).catch(() => null)))).filter(value => value !== null);
	}

	/**
	 * Serialize a value
	 * @since 0.5.0
	 * @param {Set} set The set to serialize
	 * @returns {*}
	 */
	serialize(set) {
		return [...set];
	}

};
