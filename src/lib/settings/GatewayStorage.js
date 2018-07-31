const SchemaFolder = require('./SchemaFolder');
const { join } = require('path');
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
	 * Where the bwd folder is located at.
	 * @since 0.5.0
	 * @type {string}
	 * @readonly
	 */
	get baseDirectory() {
		return join(this.client.userBaseDirectory, 'bwd');
	}

	/**
	 * Where the file schema is located at.
	 * @since 0.5.0
	 * @type {string}
	 * @readonly
	 */
	get filePath() {
		return join(this.client.userBaseDirectory, 'bwd', `${this.type}.schema.json`);
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
		const { provider } = this;
		if (!provider) throw new Error(`This provider (${this.providerName}) does not exist in your system.`);
		this.ready = true;

		// Init the Schema
		await fs.ensureDir(this.baseDirectory);
		let schema;
		try {
			schema = await fs.readJSON(this.filePath);
		} catch (error) {
			// Make the schema the default one
			schema = defaultSchema;

			// If the file is written, there must be an issue with the file, emit an
			// error instead of overwriting it (which would result to data loss). If
			// the file does not exist, write the default schema.
			if (error.code === 'ENOENT') await fs.outputJSONAtomic(this.filePath, defaultSchema);
			else this.client.emit('error', error);
		}

		this.schema = new SchemaFolder(this.client, this, schema, null, '');

		// Init the table
		const hasTable = await provider.hasTable(this.type);
		if (!hasTable) await provider.createTable(this.type);
	}

}

module.exports = GatewayStorage;
