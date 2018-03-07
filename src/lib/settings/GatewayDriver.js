const SettingResolver = require('../parsers/SettingResolver');
const Gateway = require('./Gateway');

/**
 * <warning>GatewayDriver is a singleton, use {@link KlasaClient#gateways} instead.</warning>
 * Gateway's driver to make new instances of it, with the purpose to handle different databases simultaneously.
 */
class GatewayDriver {

	/**
	 * @typedef {Object} GatewayDriverAddOptions
	 * @property {string} [provider] The name of the provider to use
	 * @property {boolean} [nice=false] Whether the JSON provider should use sequential or burst mode
	 */

	/**
	 * @typedef {Object} GatewayDriverGuildsSchema
	 * @property {SchemaPieceJSON} prefix The per-guild's configurable prefix key
	 * @property {SchemaPieceJSON} language The per-guild's configurable language key
	 * @property {SchemaPieceJSON} disableNaturalPrefix The per-guild's configurable disableNaturalPrefix key
	 * @property {SchemaPieceJSON} disabledCommands The per-guild's configurable disabledCommands key
	 * @private
	 */

	/**
	 * @typedef {Object} GatewayDriverClientStorageSchema
	 * @property {SchemaPieceJSON} userBlacklist The client's configurable user blacklist key
	 * @property {SchemaPieceJSON} guildBlacklist The client's configurable guild blacklist key
	 * @property {SchemaPieceJSON} schedules The schedules where {@link ScheduledTask}s are stored at
	 * @private
	 */

	/**
	 * @since 0.3.0
	 * @param {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		/**
		 * The client this GatewayDriver was created with.
		 * @since 0.3.0
		 * @name GatewayDriver#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The register creation queue.
		 * @since 0.5.0
		 * @name GatewayDriver#_queue
		 * @type {Map<string, Function>}
		 * @readonly
		 * @private
		 */
		Object.defineProperty(this, '_queue', { value: new Map() });

		/**
		 * The resolver instance this Gateway uses to parse the data.
		 * @type {SettingResolver}
		 */
		this.resolver = new SettingResolver(client);

		/**
		 * All the types accepted for the Gateway.
		 * @type {Set<string>}
		 */
		this.types = new Set(Object.getOwnPropertyNames(SettingResolver.prototype).slice(1));

		/**
		 * All the gateways added
		 * @type {Set<string>}
		 */
		this.keys = new Set();

		/**
		 * If the driver is ready
		 * @type {boolean}
		 */
		this.ready = false;

		/**
		 * The Gateway that manages per-guild data
		 * @type {?Gateway}
		 */
		this.guilds = null;

		/**
		 * The Gateway that manages per-user data
		 * @type {?Gateway}
		 */
		this.users = null;

		/**
		 * The Gateway that manages per-client data
		 * @type {?Gateway}
		 */
		this.clientStorage = null;
	}

	/**
	 * The data schema Klasa uses for guild configs.
	 * @since 0.5.0
	 * @readonly
	 * @type {GatewayDriverGuildsSchema}
	 */
	get guildsSchema() {
		return {
			prefix: {
				type: 'string',
				default: this.client.options.prefix,
				min: null,
				max: 10,
				array: this.client.options.prefix.constructor.name === 'Array',
				configurable: true,
				sql: `VARCHAR(10) NOT NULL DEFAULT '${this.client.options.prefix.constructor.name === 'Array' ? JSON.stringify(this.client.options.prefix) : this.client.options.prefix}'`
			},
			language: {
				type: 'language',
				default: this.client.options.language,
				min: null,
				max: null,
				array: false,
				configurable: true,
				sql: `VARCHAR(5) NOT NULL DEFAULT '${this.client.options.language}'`
			},
			disableNaturalPrefix: {
				type: 'boolean',
				default: false,
				min: null,
				max: null,
				array: false,
				configurable: Boolean(this.client.options.regexPrefix),
				sql: `BIT(1) NOT NULL DEFAULT 0`
			},
			disabledCommands: {
				type: 'command',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: true,
				sql: 'TEXT'
			}
		};
	}

	/**
	 * The data schema Klasa uses for client-wide configs.
	 * @since 0.5.0
	 * @readonly
	 * @type {GatewayDriverClientStorageSchema}
	 */
	get clientStorageSchema() {
		return {
			userBlacklist: {
				type: 'user',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: true,
				sql: 'TEXT'
			},
			guildBlacklist: {
				type: 'string',
				default: [],
				min: 17,
				max: 19,
				array: true,
				configurable: true,
				sql: 'TEXT'
			},
			schedules: {
				type: 'any',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: false,
				sql: 'TEXT'
			}
		};
	}

	/**
	 * Registers a new Gateway.
	 * @since 0.5.0
	 * @param {string} name The name for the new gateway
	 * @param {Object} [schema={}] The schema for use in this gateway
	 * @param {GatewayDriverAddOptions} [options={}] The options for the new gateway
	 * @chainable
	 * @returns {this}
	 */
	register(name, schema = {}, options = {}) {
		if (!this.ready) {
			if (this._queue.has(name)) throw new Error(`There is already a Gateway with the name '${name}'.`);
			this._queue.set(name, () => {
				this._register(name, schema, options);
				this._queue.delete(name);
			});
		} else {
			this._register(name, schema, options);
		}

		return this;
	}

	/**
	 * Readies up all Gateways and Configuration instances
	 * @since 0.5.0
	 * @returns {Array<Array<external:Collection<string, Configuration>>>}
	 * @private
	 */
	async _ready() {
		if (this.ready) throw new Error('Configuration has already run the ready method.');
		this.ready = true;
		const promises = [];
		for (const register of this._queue.values()) register();
		for (const key of this.keys) {
			// If the gateway did not init yet, init it now
			if (!this[key].ready) await this[key].init();
			promises.push(this[key]._ready());
		}
		return Promise.all(promises);
	}

	/**
	 * Registers a new Gateway
	 * @since 0.5.0
	 * @param {string} name The name for the new gateway
	 * @param {Object} schema The schema for use in this gateway
	 * @param {GatewayDriverAddOptions} options The options for the new gateway
	 * @returns {Gateway}
	 * @private
	 */
	_register(name, schema, options) {
		if (typeof name !== 'string') throw new Error('You must pass a name for your new gateway and it must be a string.');

		if (this[name] !== undefined && this[name] !== null) throw new Error(`There is already a Gateway with the name '${name}'.`);
		if (!this.client.methods.util.isObject(schema)) throw new Error('Schema must be a valid object or left undefined for an empty object.');

		options.provider = this._checkProvider(options.provider || this.client.options.providers.default);
		const provider = this.client.providers.get(options.provider);
		if (provider.cache) throw new Error(`The provider ${provider.name} is designed for caching, not persistent data. Please try again with another.`);

		const gateway = new Gateway(this, name, schema, options);
		this.keys.add(name);
		this[name] = gateway;

		return gateway;
	}

	/**
	 * Check if a provider exists.
	 * @since 0.5.0
	 * @param {string} engine Check if a provider exists
	 * @returns {string}
	 * @private
	 */
	_checkProvider(engine) {
		if (this.client.providers.has(engine)) return engine;
		throw new Error(`This provider (${engine}) does not exist in your system.`);
	}

	/**
	 * The GatewayDriver with all gateways, types and keys as JSON.
	 * @since 0.5.0
	 * @returns {Object}
	 */
	toJSON() {
		const object = {
			types: [...this.types],
			keys: [...this.keys],
			ready: this.ready
		};
		for (const key of this.keys) object[key] = this[key].toJSON();

		return object;
	}

	/**
	 * The stringified GatewayDriver with all the managed gateways.
	 * @since 0.5.0
	 * @returns {string}
	 */
	toString() {
		return `GatewayDriver(${[...this.keys].join(', ')})`;
	}

}

module.exports = GatewayDriver;
