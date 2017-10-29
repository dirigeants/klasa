const Piece = require('./interfaces/Piece');

/**
 * Base class for all Klasa Providers. See {@tutorial CreatingProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 */
class Provider {

	/**
	 * @typedef {Object} ProviderOptions
	 * @memberof Provider
	 * @property {string} [name=theFileName] The name of the provider
	 * @property {boolean} [enabled=true] Whether the provider is enabled or not
	 * @property {string} [description=''] The provider description
	 * @property {boolean} [sql=false] If the provider provides to a sql datasource
	 */

	/**
	 * @param {KlasaClient} client The Klasa client
	 * @param {string} dir The path to the core or user provider pieces folder
	 * @param {string} file The path from the pieces folder to the provider file
	 * @param {ProviderOptions} [options = {}] Optional Provider settings
	 */
	constructor(client, dir, file, options = {}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The directory to where this provider piece is stored
		 * @type {string}
		 */
		this.dir = dir;

		/**
		 * The file location where this provider is stored
		 * @type {string}
		 */
		this.file = file;

		/**
		 * The name of the provider
		 * @type {string}
		 */
		this.name = options.name || file.slice(0, -3);

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'provider';

		/**
		 * If the provider is enabled or not
		 * @type {boolean}
		 */
		this.enabled = 'enabled' in options ? options.enabled : true;

		/**
		 * The description of the provider
		 * @type {string}
		 */
		this.description = options.description || '';

		/**
		 * If the provider provides to a sql datasource
		 * @type {boolean}
		 */
		this.sql = 'sql' in options ? options.sql : false;

		/**
		 * If the provider is designed to handle cache operations
		 * @type {boolean}
		 */
		this.cache = 'cache' in options ? options.cache : false;
	}

	/**
	 * The init method to be optionaly overwritten in actual provider pieces
	 * @abstract
	 * @returns {void}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

	/**
	 * The shutdown method to be optionaly overwritten in actual provider pieces
	 * @abstract
	 * @returns {void}
	 */
	async shutdown() {
		// Optionally defined in extension Classes
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	async reload() {}
	unload() {}
	disable() {}
	enable() {}
	/* eslint-enable no-empty-function */

}

Piece.applyToClass(Provider);

module.exports = Provider;
