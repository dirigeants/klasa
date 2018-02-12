const Piece = require('./interfaces/Piece');
const { mergeDefault } = require('../util/util');

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 * @implements {Piece}
 */
class Provider {

	/**
	 * @typedef {Object} ProviderOptions
	 * @property {string} [name=theFileName] The name of the provider
	 * @property {boolean} [enabled=true] Whether the provider is enabled or not
	 * @property {boolean} [sql=false] If the provider provides to a sql data source
	 * @memberof Provider
	 */

	/**
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} file The path from the pieces folder to the provider file
	 * @param {boolean} core If the piece is in the core directory or not
	 * @param {ProviderOptions} [options={}] Optional Provider settings
	 */
	constructor(client, file, core, options = {}) {
		options = mergeDefault(client.options.pieceDefaults.providers, options);

		/**
		 * @since 0.0.1
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The file location where this provider is stored
		 * @since 0.0.1
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the provider
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @since 0.0.1
		 * @type {string}
		 */
		this.type = 'provider';

		/**
		 * If the provider is enabled or not
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.enabled = options.enabled;

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

		/**
		 * If the piece is in the core directory or not
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.core = core;

		/**
		 * The store this piece is from
		 * @since 0.5.0
		 * @type {Store}
		 */
		this.store = this.client.pieceStores.get(`${this.type}s`);
	}

	/**
	 * The init method to be optionally overwritten in actual provider pieces
	 * @since 0.0.1
	 * @returns {Promise<void>}
	 * @abstract
	 */
	async init() {
		// Optionally defined in extension Classes
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
			dir: this.dir,
			file: this.file,
			name: this.name,
			type: this.type,
			enabled: this.enabled,
			sql: this.sql,
			cache: this.cache
		};
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	get dir() {}
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	toString() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Provider, ['toJSON']);

module.exports = Provider;
