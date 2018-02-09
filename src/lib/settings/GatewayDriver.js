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
	 * @memberof GatewayDriver
	 */

	/**
	 * @typedef {Object} GatewayDriverGuildsSchema
	 * @property {SchemaPieceJSON} prefix The per-guild's configurable prefix key
	 * @property {SchemaPieceJSON} language The per-guild's configurable language key
	 * @property {SchemaPieceJSON} disableNaturalPrefix The per-guild's configurable disableNaturalPrefix key
	 * @property {SchemaPieceJSON} disabledCommands The per-guild's configurable disabledCommands key
	 * @memberof GatewayDriver
	 * @private
	 */

	/**
	 * @typedef {Object} GatewayDriverClientStorageSchema
	 * @property {SchemaPieceJSON} userBlacklist The client's configurable user blacklist key
	 * @property {SchemaPieceJSON} guildBlacklist The client's configurable guild blacklist key
	 * @property {SchemaPieceJSON} schedules The schedules where {@link ScheduledTask}s are stored at
	 * @memberof GatewayDriver
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
	 * @param {string} name The name for the new gateway
	 * @param {Object} [schema={}] The schema for use in this gateway
	 * @param {GatewayDriverAddOptions} [options={}] The options for the new gateway
	 * @returns {Gateway}
	 */
	register(name, schema = {}, options = {}) {
		if (typeof name !== 'string') throw 'You must pass a name for your new gateway and it must be a string.';

		if (name in this) throw 'There is already a Gateway with that name.';
		if (!this.client.methods.util.isObject(schema)) throw 'Schema must be a valid object or left undefined for an empty object.';

		options.provider = this._checkProvider(options.provider || this.client.options.providers.default);
		const provider = this.client.providers.get(options.provider);
		if (provider.cache) throw `The provider ${provider.name} is designed for caching, not persistent data. Please try again with another.`;

		const gateway = new Gateway(this, name, schema, options);
		this.keys.add(name);
		this[name] = gateway;

		return gateway;
	}

	/**
	 * Registers a new Gateway and inits it.
	 * @since 0.3.0
	 * @param {string} name The name for the new instance
	 * @param {Object} [schema={}] The schema
	 * @param {GatewayDriverAddOptions} [options={}] A provider to use. If not specified it'll use the one in the client
	 * @param {boolean} [download=true] Whether this Gateway should download the data from the database at init
	 * @returns {Gateway}
	 * @example
	 * // Add a new SettingGateway instance, called 'users', which input takes users, and stores a quote which is a string between 2 and 140 characters.
	 * const schema = {
	 *	 quote: {
	 *		 type: 'String',
	 *		 default: null,
	 *		 array: false,
	 *		 min: 2,
	 *		 max: 140,
	 *	 },
	 * };
	 * GatewayDriver.add('users', schema);
	 */
	async add(name, schema = {}, options = {}, download = true) {
		const gateway = this.register(name, schema, options);
		await gateway.init(download);

		return gateway;
	}

	/**
	 * Readies up all Gateways and Configuration instances
	 * @since 0.5.0
	 * @returns {Promise<Array<Array<external:Collection<string, Configuration>>>>}
	 * @private
	 */
	async _ready() {
		if (this.ready) throw 'Configuration has already run the ready method.';
		this.ready = true;
		const promises = [];
		for (const cache of this.caches) {
			// If the gateway did not init yet, init it now
			if (!this[cache].ready) await this[cache].init();
			promises.push(this[cache]._ready());
		}
		return Promise.all(promises);
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
		throw `This provider (${engine}) does not exist in your system.`;
	}

}

module.exports = GatewayDriver;
