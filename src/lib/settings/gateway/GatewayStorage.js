const Schema = require('../schema/Schema');

class GatewayStorage {

	/**
	 * @typedef {Object} GatewayJSON
	 * @property {string} name The name of this gateway
	 * @property {string} provider The provider's name
	 * @property {Object} schema The current schema
	 */

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client this GatewayStorage was created with
	 * @param {string} name The name of this GatewayStorage
	 * @param {Object} [options = {}] The options for this gateway
	 * @param {Schema} [options.schema = new Schema()] The schema for this gateway
	 * @param {string} [options.provider = this.client.options.providers.default] The provider's name for this gateway
	 * @private
	 */
	constructor(client, name, { schema = new Schema(), provider = client.options.providers.default }) {
		/**
		 * The client this GatewayStorage was created with.
		 * @since 0.5.0
		 * @name GatewayStorage#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The name of this GatewayStorage.
		 * @since 0.5.0
		 * @name GatewayStorage#name
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'name', { value: name });

		/**
		 * The name of this instance's provider.
		 * @since 0.5.0
		 * @name GatewayStorage#_provider
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, '_provider', { value: provider });

		/**
		 * The schema for this instance
		 * @since 0.5.0
		 * @name GatewayStorage#schema
		 * @type {Schema}
		 * @readonly
		 */
		Object.defineProperty(this, 'schema', { value: schema, enumerable: true });

		/**
		 * Whether or not this gateway is considered ready.
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
		return this.client.providers.get(this._provider) || null;
	}

	/**
	 * Sync placeholder to allow GatewayStorage to be registered
	 * @since 0.5.0
	 * @returns {this}
	 */
	async sync() {
		return this;
	}

	/**
	 * Inits the current Gateway.
	 * @since 0.5.0
	 */
	async init() {
		// A gateway must not init twice
		if (this.ready) throw new Error(`[INIT] ${this} has already initialized.`);

		// Check the provider's existence
		const { provider } = this;
		if (!provider) throw new Error(`This provider (${this.providerName}) does not exist in your system.`);
		this.ready = true;

		const errors = [];
		for (const piece of this.schema.values(true)) {
			// Assign Client to all Pieces for Serializers && Type Checking
			piece.client = this.client;

			Object.freeze(piece);

			// Check if the piece is valid
			try {
				piece.isValid();
			} catch (error) {
				errors.push(error.message);
			}
		}

		if (errors.length) throw new Error(`[SCHEMA] There is an error with your schema.\n${errors.join('\n')}`);

		// Init the table
		const hasTable = await provider.hasTable(this.name);
		if (!hasTable) await provider.createTable(this.name);

		// Add any missing columns (NoSQL providers return empty array)
		const columns = await provider.getColumns(this.name);
		if (columns.length) {
			const promises = [];
			for (const [key, piece] of this.schema.paths) if (!columns.includes(key)) promises.push(provider.addColumn(this.name, piece));
			await Promise.all(promises);
		}
	}

	/**
	 * Get a JSON object containing the schema and options.
	 * @since 0.5.0
	 * @returns {GatewayJSON}
	 */
	toJSON() {
		return {
			name: this.name,
			provider: this._provider,
			schema: this.schema.toJSON()
		};
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `Gateway(${this.name})`;
	}

}

module.exports = GatewayStorage;
