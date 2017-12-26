const SettingResolver = require('../parsers/SettingResolver');
const Gateway = require('./Gateway');

/**
 * Gateway's driver to make new instances of it, with the purpose to handle different databases simultaneously.
 */
class GatewayDriver {

	/**
	 * @typedef {Object} SettingsOptions
	 * @property {string} [provider]
	 * @property {boolean} [nice]
	 * @memberof GatewayDriver
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
		 * @type {string[]}
		 */
		this.types = Object.getOwnPropertyNames(SettingResolver.prototype).slice(1);

		/**
		 * All the caches added
		 * @type {string[]}
		 */
		this.caches = [];

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
				type: 'guild',
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
	 * Add a new instance of SettingGateway, with its own validateFunction and schema.
	 * @since 0.3.0
	 * @param {string} name The name for the new instance
	 * @param {Function} validateFunction The function that validates the input
	 * @param {Object} [schema={}] The schema
	 * @param {SettingsOptions} [options={}] A provider to use. If not specified it'll use the one in the client
	 * @param {boolean} [download=true] Whether this Gateway should download the data from the database at init
	 * @returns {Gateway}
	 * @example
	 * // Add a new SettingGateway instance, called 'users', which input takes users, and stores a quote which is a string between 2 and 140 characters.
	 * const validate = async function(resolver, user) {
	 *	 const result = await resolver.user(user);
	 *	 if (!result) throw 'The parameter <User> expects either a User ID or a User Object.';
	 *	 return result;
	 * };
	 * const schema = {
	 *	 quote: {
	 *		 type: 'String',
	 *		 default: null,
	 *		 array: false,
	 *		 min: 2,
	 *		 max: 140,
	 *	 },
	 * };
	 * GatewayDriver.add('users', validate, schema);
	 */
	async add(name, validateFunction, schema = {}, options = {}, download = true) {
		if (typeof name !== 'string') throw 'You must pass a name for your new gateway and it must be a string.';

		if (this[name] !== undefined && this[name] !== null) throw 'There is already a Gateway with that name.';
		if (typeof validateFunction !== 'function') throw 'You must pass a validate function.';
		validateFunction = validateFunction.bind(this);
		if (!this.client.methods.util.isObject(schema)) throw 'Schema must be a valid object or left undefined for an empty object.';

		options.provider = this._checkProvider(options.provider || this.client.options.provider.engine || 'json');
		if (options.provider.cache) throw `The provider ${options.provider.name} is designed for caching, not persistent data. Please try again with another.`;
		options.cache = this._checkProvider('collection');

		const gateway = new Gateway(this, name, validateFunction, schema, options);
		await gateway.init(download);
		this.caches.push(name);
		this[name] = gateway;

		return gateway;
	}

	/**
	 * Readies up all Gateways and Configuration instances
	 * @since 0.5.0
	 * @returns {Promise<Array<Array<external:Collection<string, Configuration>>>>}
	 * @private
	 */
	_ready() {
		if (this.ready) throw 'Configuration has already run the ready method.';
		this.ready = true;
		const promises = [];
		for (const cache of this.caches) {
			this[cache].ready = true;
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
