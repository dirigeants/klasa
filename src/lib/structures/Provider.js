const Piece = require('./base/Piece');
const { isObject, makeObject, getDeepTypeName } = require('../util/util');

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 * @extends {Piece}
 */
class Provider extends Piece {

	/**
	 * @typedef {PieceOptions} ProviderOptions
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {ProviderStore} store The Provider Store
	 * @param {string} file The path from the pieces folder to the provider file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {ProviderOptions} [options={}] Optional Provider settings
	 */
	constructor(client, store, file, core, options = {}) {
		super(client, store, file, core, options);

		/**
		 * If the provider is designed to handle cache operations
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.cache = options.cache;
	}

	/**
	 * The shutdown method to be optionally overwritten in actual provider pieces
	 * @since 0.3.0
	 * @returns {void}
	 * @abstract
	 */
	async shutdown() {
		// Optionally defined in extension Classes
	}

	/**
	 * Helper method to abstract the overload parsing to JSON for all NoSQL databases.
	 * @since 0.5.0
	 * @param {ConfigurationUpdateResultEntry[]|Array<Array<string>>|Object<string, *>} data The data to parse
	 * @returns {Object<string, *>}
	 */
	parseInput(data) {
		if (Array.isArray(data)) {
			const [first] = data;
			const output = {};
			if (first.data && first.piece) {
				// [{ data: [string, *], piece: SchemaPiece }, ...]
				for (const entry of data) makeObject(entry.data[0], entry.data[1], output);
				return output;
			}

			if (Array.isArray(first) && first.length === 2) {
				// [[string, *], ...]
				for (const entry of data) makeObject(entry[0], entry[1], output);
				return output;
			}
		} else if (isObject(data)) {
			// Object
			return data;
		}

		throw new TypeError(`The type ${getDeepTypeName(data)} is unsupported. The supported types are ConfigurationUpdateResultEntry[], [string, *][] or Object.`);
	}

	/**
	 * Defines the JSON.stringify behavior of this provider.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			cache: this.cache
		};
	}

}

module.exports = Provider;
