const Gateway = require('./Gateway');
const GatewaySQL = require('./GatewaySQL');
const SettingResolver = require('../parsers/SettingResolver');
const { Guild, User } = require('discord.js');

/**
 * Gateway's driver to make new instances of it, with the purpose to handle different databases simultaneously.
 */
class GatewayDriver {

	/**
	 * @typedef  {Object} SettingsOptions
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
		 * @type {string[]}
		 */
		this.ready = false;
	}

	/**
	 * The data schema Klasa uses for guild configs.
	 * @since 0.3.0
	 * @readonly
	 */
	get defaultDataSchema() {
		return {
			prefix: {
				type: 'string',
				default: this.client.config.prefix,
				array: this.client.config.prefix.constructor.name === 'Array',
				min: null,
				max: 10,
				sql: `VARCHAR(10) NOT NULL DEFAULT '${this.client.config.prefix.constructor.name === 'Array' ? JSON.stringify(this.client.config.prefix) : this.client.config.prefix}'`
			},
			language: {
				type: 'language',
				default: this.client.config.language,
				min: null,
				max: null,
				array: false,
				sql: `VARCHAR(5) NOT NULL DEFAULT '${this.client.config.language}'`
			},
			disabledCommands: {
				type: 'command',
				default: [],
				min: null,
				max: null,
				array: true,
				sql: 'TEXT'
			}
		};
	}

	/**
	 * Add a new instance of SettingGateway, with its own validateFunction and schema.
	 * @since 0.3.0
	 * @param {string} name The name for the new instance.
	 * @param {Function} validateFunction The function that validates the input.
	 * @param {Object} [schema={}] The schema.
	 * @param {SettingsOptions} [options={}] A provider to use. If not specified it'll use the one in the client.
	 * @param {boolean} [download=true] Whether this Gateway should download the data from the database at init.
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
		if (typeof this[name] !== 'undefined') throw 'There is already a Gateway with that name.';
		if (typeof validateFunction !== 'function') throw 'You must pass a validate function.';
		validateFunction = validateFunction.bind(this);
		if (schema.constructor.name !== 'Object') throw 'Schema must be a valid object or left undefined for an empty object.';

		options.provider = this._checkProvider(options.provider || this.client.config.provider.engine || 'json');
		if (options.provider.cache) throw `The provider ${options.provider.name} is designed for caching, not persistent data. Please try again with another.`;
		options.cache = this._checkProvider('collection');
		if (options.cache.cache === false) throw `The provider ${options.cache.name} is designed for persistent data, not cache. Please try again with another.`;

		if (options.provider.sql) this[name] = new GatewaySQL(this, name, validateFunction, schema, options);
		else this[name] = new Gateway(this, name, validateFunction, schema, options);

		await this[name].init(download);
		this.caches.push(name);
		return this[name];
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
	 * @param {string} engine Check if a provider exists.
	 * @returns {Provider}
	 * @private
	 */
	_checkProvider(engine) {
		const provider = this.client.providers.get(engine);
		if (!provider) throw `This provider (${engine}) does not exist in your system.`;

		return provider;
	}

	/**
	 * The validator function Klasa uses for guild configs.
	 * @since 0.5.0
	 * @param {(Object|string)} guildResolvable The guild to validate.
	 * @returns {KlasaGuild}
	 * @private
	 */
	async validateGuild(guildResolvable) {
		if (guildResolvable) {
			let value;

			if (typeof guildResolvable === 'string' && /^\d{17,19}$/.test(guildResolvable)) value = this.client.guilds.get(guildResolvable);
			else if (guildResolvable instanceof Guild) value = guildResolvable;
			if (value) return value;
		}

		throw 'The parameter <Guild> expects either a Guild ID or a Guild Instance.';
	}

	/**
	 * The validator function Klasa uses for user configs.
	 * @since 0.5.0
	 * @param {(Object|string)} userResolvable The user to validate.
	 * @returns {KlasaUser}
	 * @private
	 */
	async validateUser(userResolvable) {
		if (userResolvable) {
			let value;

			if (typeof userResolvable === 'string' && /^\d{17,19}$/.test(userResolvable)) value = await this.client.users.fetch(userResolvable);
			else if (userResolvable instanceof User) value = userResolvable;
			if (value) return value;
		}

		throw 'The parameter <User> expects either a User ID or a User Instance.';
	}

}

module.exports = GatewayDriver;
