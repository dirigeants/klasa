const SchemaFolder = require('./SchemaFolder');
const { resolve } = require('path');
const fs = require('fs-nextra');

class GatewayStorage {

	/**
	 * <warning>You should never create an instance of this class as it's abstract.</warning>
	 * @since 0.5.0
	 * @param {KlasaClient} client The client this GatewayStorage was created with
	 * @param {string} type The name of this GatewayStorage
	 * @param {string} [provider] The provider's name
	 * @private
	 */
	constructor(client, type, provider) {
		/**
		 * The client this GatewayStorage was created with.
		 * @since 0.5.0
		 * @name GatewayStorage#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The type of this GatewayStorage.
		 * @since 0.5.0
		 * @name GatewayStorage#type
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: type });

		/**
		 * The name of this instance's provider.
		 * @since 0.5.0
		 * @name GatewayStorage#providerName
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'providerName', { value: provider || this.client.options.providers.default });

		/**
		 * Where the bwd folder is located at.
		 * @since 0.5.0
		 * @name GatewayStorage#baseDir
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'baseDir', { value: resolve(this.client.clientBaseDir, 'bwd') });

		/**
		 * Where the file schema is located at.
		 * @since 0.5.0
		 * @name GatewayStorage#filePath
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'filePath', { value: resolve(this.baseDir, `${this.type}.schema.json`) });

		/**
		 * @since 0.5.0
		 * @type {SchemaFolder}
		 */
		this.schema = null;

		/**
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.ready = false;
	}

	/**
	 * Get the provider that manages the persistent data.
	 * @since 0.5.0
	 * @type {?Provider}
	 * @readonly
	 */
	get provider() {
		return this.client.providers.get(this.providerName) || null;
	}

	/**
	 * Get this gateway's defaults.
	 * @since 0.5.0
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		return { ...this.schema.defaults, default: true };
	}

	/**
	 * Inits the current Gateway.
	 * @since 0.5.0
	 * @param {Object} defaultSchema The default schema
	 */
	async init(defaultSchema) {
		if (this.ready) throw new Error(`[INIT] ${this} has already initialized.`);
		if (!this.provider) throw new Error(`This provider (${this.providerName}) does not exist in your system.`);
		this.ready = true;

		// Init the Schema
		await fs.ensureDir(this.baseDir);
		let schema;
		try {
			schema = await fs.readJSON(this.filePath);
		} catch (error) {
			// Make the schema the default one
			schema = defaultSchema;

			// Check if the file exists
			const fileWritten = await fs.pathExists(this.filePath);

			// If the file is written, there must be an issue with the file, emit an
			// error instead of overwritting it (which would result to data loss). If
			// the file does not exist, write the default schema.
			if (fileWritten) this.client.emit('error', error);
			else await fs.outputJSONAtomic(this.filePath, defaultSchema);
		}

		this.schema = new SchemaFolder(this.client, this, schema, null, '');

		// Init the table
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) await this.provider.createTable(this.type);
	}

}

module.exports = GatewayStorage;
