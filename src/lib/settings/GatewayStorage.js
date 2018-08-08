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
	async init() {
		if (this.ready) throw new Error(`[INIT] ${this} has already initialized.`);
		const { provider } = this;
		if (!provider) throw new Error(`This provider (${this.providerName}) does not exist in your system.`);
		this.ready = true;
		// TODO:  Could Potentially make the Schema here if they choose to not change from json to the schema constructor
		// their choice if they want slower startup

		const debug = this.schema.debug();
		if (debug.length) throw new Error(`[SCHEMA] There is an error with your schema. \n ${debug.join('\n')}`);
		// Init the table
		const hasTable = await provider.hasTable(this.type);
		if (!hasTable) await provider.createTable(this.type);
	}

}

module.exports = GatewayStorage;
