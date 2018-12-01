const { Dataset, Type } = require('klasa');

module.exports = class extends Dataset {

	constructor(...args) {
		super(...args, { default: [] });
	}

	/**
	 * @typedef {Object} ArrayDatasetOptions
	 * @property {number} [index] The index to perform the operation at
	 * @property {boolean} [replace] Whether the operation should replace the element, only for add
	 */

	/**
	 * Set a value
	 * @since 0.5.0
	 * @param {Array} value The value to set
	 * @returns {Array}
	 */
	set(value) {
		if (Array.isArray(value)) return value;
		throw new TypeError(`Expected an array, got ${new Type(value)}`);
	}

	/**
	 * Add a value to the array
	 * @since 0.5.0
	 * @param {Array} array The array to add the data to
	 * @param {*} value The value to add to the array
	 * @param {ArrayDatasetOptions} [options={}] The options
	 * @returns {Array}
	 */
	add(array, value, options = {}) {
		if ('index' in options) array.splice(options.index, Number(options.replace), value);
		else array.push(value);
		return array;
	}

	/**
	 * Remove a value from the array
	 * @since 0.5.0
	 * @param {Array} array The array to remove the data from
	 * @param {*} value The value to remove from the array
	 * @param {ArrayDatasetOptions} [options={}] The options
	 * @returns {Array}
	 */
	remove(array, value, options = {}) {
		const index = 'index' in options ? options.index : array.indexOf(value);
		if (index !== -1) array.splice(index, 1);
		return array;
	}

	/**
	 * Resolve an array
	 * @since 0.5.0
	 * @param {Array} array The array to serialize
	 * @param {SchemaPiece} schemaPiece The SchemaPiece instance that provides context
	 * @param {Language} language The language instance for i18n messages
	 * @param {KlasaGuild} [guild] The guild for context
	 * @returns {Promise<Array>}
	 */
	async deserialize(array, schemaPiece, language, guild) {
		const { serializer } = schemaPiece;
		return (await Promise.all(this.set(array).map(value => serializer.deserialize(value, schemaPiece, language, guild).catch(() => null)))).filter(value => value !== null);
	}

};
