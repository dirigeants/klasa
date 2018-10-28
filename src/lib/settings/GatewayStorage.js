class GatewayStorage {

	/**
	 * @typedef {Object} GatewayJSON
	 * @property {string} type The name of this gateway
	 * @property {GatewayDriverRegisterOptions} options The options for this gateway
	 * @property {Object} schema The current schema
	 */

	/**
	 * <warning>You should never create an instance of this class as it's abstract.</warning>
	 * @since 0.5.0
	 * @param {KlasaClient} client The client this GatewayStorage was created with
	 * @param {string} type The name of this GatewayStorage
	 * @param {Schema} schema The schema for this gateway
	 * @param {string} [provider] The provider's name
	 * @private
	 */
	constructor(client, type, schema, provider) {
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
		 * @type {Schema}
		 */
		this.schema = schema;

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
		const hasTable = await provider.hasTable(this.type);
		if (!hasTable) await provider.createTable(this.type);

		// Add any missing columns (NoSQL providers return empty array)
		const columns = await provider.getColumns(this.type);
		if (columns.length) {
			const promises = [];
			for (const [key, piece] of this.schema.paths) if (!columns.includes(key)) promises.push(provider.addColumn(this.type, piece));
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
			type: this.type,
			options: { provider: this.providerName },
			schema: this.schema.toJSON()
		};
	}

	/**
	 * Stringify a value or the instance itself.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `Gateway(${this.type})`;
	}

}

module.exports = GatewayStorage;
