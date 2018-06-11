const SettingResolver = require('../parsers/SettingResolver');
const Gateway = require('./Gateway');
const util = require('../util/util');

/**
 * <warning>GatewayDriver is a singleton, use {@link KlasaClient#gateways} instead.</warning>
 * Gateway's driver to make new instances of it, with the purpose to handle different databases simultaneously.
 */
class GatewayDriver {

	/**
	 * @typedef {Object} GatewayDriverRegisterOptions
	 * @property {string} [provider] The name of the provider to use
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
		 * @type {Array<Function>}
		 * @readonly
		 * @private
		 */
		Object.defineProperty(this, '_queue', { value: [] });

		/**
		 * The resolver instance this Gateway uses to parse the data.
		 * @type {SettingResolver}
		 */
		this.resolver = new SettingResolver(client);

		/**
		 * All the types accepted for the Gateway.
		 * @type {?Set<string>}
		 */
		this.types = null;

		/**
		 * All the gateways added
		 * @type {Set<string>}
		 */
		this.keys = new Set();

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
				array: Array.isArray(this.client.options.prefix),
				configurable: true
			},
			language: {
				type: 'language',
				default: this.client.options.language,
				min: null,
				max: null,
				array: false,
				configurable: true
			},
			disableNaturalPrefix: {
				type: 'boolean',
				default: false,
				min: null,
				max: null,
				array: false,
				configurable: Boolean(this.client.options.regexPrefix)
			},
			disabledCommands: {
				type: 'command',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: true
			}
		};
	}

	/**
	 * The data schema Klasa uses for user configs.
	 * @since 0.5.0
	 * @readonly
	 * @type {GatewayDriverUsersSchema}
	 */
	get usersSchema() {
		return {};
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
				configurable: true
			},
			guildBlacklist: {
				type: 'string',
				default: [],
				min: 17,
				max: 19,
				array: true,
				configurable: true
			},
			schedules: {
				type: 'any',
				default: [],
				min: null,
				max: null,
				array: true,
				configurable: false
			}
		};
	}

	/**
	 * Registers a new Gateway.
	 * @since 0.5.0
	 * @param {string} name The name for the new gateway
	 * @param {Object} [defaultSchema = {}] The schema for use in this gateway
	 * @param {GatewayDriverRegisterOptions} [options = {}] The options for the new gateway
	 * @returns {this}
	 * @chainable
	 */
	register(name, defaultSchema = {}, { provider = this.client.options.providers.default } = {}) {
		if (typeof name !== 'string') throw new TypeError('You must pass a name for your new gateway and it must be a string.');
		if (!util.isObject(defaultSchema)) throw new TypeError('Schema must be a valid object or left undefined for an empty object.');
		if (this.name !== undefined && this.name !== null) throw new Error(`The key '${name}' is either taken by another Gateway or reserved for GatewayDriver's functionality.`);

		const gateway = new Gateway(this, name, { provider });
		this.keys.add(name);
		this[name] = gateway;
		this._queue.push(gateway.init.bind(gateway, defaultSchema));
		return this;
	}

	/**
	 * Initialise all gateways from the queue
	 * @since 0.5.0
	 */
	async init() {
		this.types = new Set(Object.getOwnPropertyNames(SettingResolver.prototype).slice(1));
		await Promise.all([...this._queue].map(fn => fn()));
		this._queue.length = 0;
	}

	/**
	 * Sync all gateways
	 * @since 0.5.0
	 * @param {...*} args The arguments to pass to each Gateway#sync
	 * @returns {Promise<Array<Gateway>>}
	 */
	sync(...args) {
		return Promise.all([...this.keys].map(key => this[key].sync(...args)));
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
