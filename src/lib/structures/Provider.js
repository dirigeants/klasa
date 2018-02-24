const Piece = require('./base/Piece');

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 * @extends {Piece}
 */
class Provider extends Piece {

	/**
	 * @typedef {PieceOptions} ProviderOptions
	 * @property {boolean} [sql=false] If the provider provides to a sql data source
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
		 * If the provider provides to a sql data source
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.sql = options.sql;

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
	 * Defines the JSON.stringify behavior of this provider.
	 * @returns {Object}
	 */
	toJSON() {
		return {
			...super.toJSON(),
			sql: this.sql,
			cache: this.cache
		};
	}

}

module.exports = Provider;
