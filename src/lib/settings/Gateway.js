const Schema = require('./Schema');
const Configuration = require('../structures/Configuration');
const { resolve } = require('path');
const fs = require('fs-nextra');
const discord = require('discord.js');

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 */
class Gateway {

	/**
	 * @typedef  {Object} GatewayOptions
	 * @property {Provider} [provider]
	 * @property {CacheProvider} [cache]
	 * @property {boolean} [nice=false]
	 * @memberof Gateway
	 */

	/**
	 * @typedef {(KlasaGuild|KlasaMessage|external:TextChannel|external:VoiceChannel|external:CategoryChannel|external:GuildChannel|external:Role)} GatewayGuildResolvable
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object} GatewayPathOptions
	 * @property {boolean} [avoidUnconfigurable=false]
	 * @property {boolean} [piece=true]
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object} GatewayPathResult
	 * @property {SchemaPiece} path
	 * @property {string[]} route
	 * @memberof Gateway
	 */

	/**
	 * @since 0.0.1
	 * @param {GatewayDriver} store The GatewayDriver instance which initiated this instance.
	 * @param {string} type The name of this Gateway.
	 * @param {Function} validateFunction The function that validates the entries' values.
	 * @param {Object} schema The initial schema for this instance.
	 * @param {GatewayOptions} options The options for this schema.
	 */
	constructor(store, type, validateFunction, schema, options) {
		/**
		 * The client this Gateway was created with.
		 * @since 0.0.1
		 * @name Gateway#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: store.client });

		/**
		 * @since 0.0.1
		 * @type {GatewayDriver}
		 */
		this.store = store;

		/**
		 * @since 0.3.0
		 * @type {string}
		 */
		this.type = type;

		/**
		 * @since 0.5.0
		 * @type {GatewayOptions}
		 */
		this.options = options;

		/**
		 * @since 0.3.0
		 * @type {Function}
		 */
		this.validate = validateFunction;

		/**
		 * @since 0.3.0
		 * @type {Object}
		 */
		this.defaultSchema = schema;

		/**
		 * @since 0.0.1
		 * @type {Schema}
		 */
		this.schema = null;

		/**
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.ready = false;

		/**
		 * @since 0.0.1
		 * @type {SettingResolver}
		 * @name Gateway#resolver
		 * @readonly
		 */
		Object.defineProperty(this, 'resolver', { value: this.store.resolver });

		/**
		 * @since 0.0.1
		 * @type {boolean}
		 * @name Gateway#sql
		 * @readonly
		 */
		Object.defineProperty(this, 'sql', { value: this.provider.sql });
	}

	/**
	 * Get the cache-provider that manages the cache data.
	 * @since 0.0.1
	 * @type {Provider}
	 * @readonly
	 */
	get cache() {
		return this.options.cache;
	}

	/**
	 * Get the provider that manages the persistent data.
	 * @since 0.0.1
	 * @type {Provider}
	 * @readonly
	 */
	get provider() {
		return this.options.provider;
	}

	/**
	 * Get this gateway's defaults.
	 * @since 0.5.0
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		return Object.assign(this.schema.defaults, { default: true });
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.0.1
	 * @param {boolean} [download=true] Whether this Gateway should download the data from the database.
	 */
	async init(download = true) {
		await this.initSchema().then(schema => { this.schema = new Schema(this.client, this, schema, ''); });
		await this.initTable();
		if (download) await this.sync();
	}

	/**
	 * Inits the table for its use in this gateway.
	 * @since 0.5.0
	 * @private
	 */
	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) await this.provider.createTable(this.type);

		const hasCacheTable = this.cache.hasTable(this.type);
		if (!hasCacheTable) this.cache.createTable(this.type);
	}

	/**
	 * Inits the schema, creating a file if it does not exist, and returning the current schema or the default.
	 * @since 0.5.0
	 * @returns {Promise<Object>}
	 * @private
	 */
	async initSchema() {
		const baseDir = resolve(this.client.clientBaseDir, 'bwd');
		await fs.ensureDir(baseDir);
		this.filePath = resolve(baseDir, `${this.type}_Schema.json`);
		return fs.readJSON(this.filePath)
			.catch(() => fs.outputJSONAtomic(this.filePath, this.defaultSchema).then(() => this.defaultSchema));
	}

	/**
	 * Get an entry from the cache.
	 * @since 0.5.0
	 * @param {string} input The key to get from the cache.
	 * @param {boolean} [create=false] Whether SG should create a new instance of Configuration in the background.
	 * @returns {(Configuration|Object)}
	 */
	getEntry(input, create = false) {
		if (input === 'default') return this.defaults;
		if (create) {
			const entry = this.cache.get(this.type, input);
			if (!entry) {
				const configs = new Configuration(this, { id: input });
				this.cache.set(this.type, input, configs);
				// Silently create a new entry. The new data does not matter as Configuration default all the keys.
				this.provider.create(this.type, input)
					.then(() => {
						configs.existsInDB = true;
						if (this.client.listenerCount('configCreateEntry')) this.client.emit('configCreateEntry', configs);
					})
					.catch(error => this.client.emit('log', error, 'error'));
				return configs;
			}
			return entry;
		}
		return this.cache.get(this.type, input) || this.defaults;
	}

	/**
	 * Create a new entry into the database with an optional content (defaults to this Gateway's defaults).
	 * @since 0.5.0
	 * @param {string} input The name of the key to create.
	 * @returns {Promise<Configuration>}
	 */
	async createEntry(input) {
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const cache = this.cache.get(this.type, target);
		if (cache && cache.existsInDB) return configs;
		await this.provider.create(this.type, target);
		const configs = cache || new Configuration(this, { id: target });
		configs.existsInDB = true;
		if (!cache) this.cache.set(this.type, target, configs);
		if (this.client.listenerCount('configCreateEntry')) this.client.emit('configCreateEntry', configs);
		return configs;
	}

	/**
	 * Generate a new entry and add it to the cache.
	 * @since 0.5.0
	 * @param {string} id The ID of the entry.
	 * @param {*} data The data to insert.
	 * @return {Configuration}
	 */
	insertEntry(id, data = {}) {
		const configs = new Configuration(this, Object.assign(data, { id }));
		this.cache.set(this.type, id, configs);
		if (this.ready) configs.sync().catch(err => this.client.emit('error', err));
		return configs;
	}

	/**
	 * Delete an entry from the database and cache.
	 * @since 0.5.0
	 * @param {string} input The name of the key to fetch and delete.
	 * @returns {Promise<boolean>}
	 */
	async deleteEntry(input) {
		const configs = this.cache.get(this.type, input);
		if (!configs) return false;

		if (configs.existsInDB) {
			await this.provider.delete(this.type, input);
			if (this.client.listenerCount('configDeleteEntry')) this.client.emit('configDeleteEntry', configs);
		}
		this.cache.delete(this.type, input);

		return true;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Object|string)} [input] An object containing a id property, like discord.js objects, or a string.
	 * @returns {Promise<boolean>}
	 */
	async sync(input) {
		if (typeof input === 'undefined') {
			const data = await this.provider.getAll(this.type);
			if (data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					const configs = new Configuration(this, data[i]);
					configs.existsInDB = true;
					this.cache.set(this.type, data[i].id, configs);
				}
			}
			return true;
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		if (data) {
			const configs = new Configuration(this, data);
			configs.existsInDB = true;
			this.cache.set(this.type, target, configs);
		}

		return true;
	}

	/**
	 * Resolve a path from a string.
	 * @since 0.5.0
	 * @param {string} [key=null] A string to resolve.
	 * @param {GatewayPathOptions} [options={}] Whether the Gateway should avoid configuring the selected key.
	 * @returns {GatewayPathResult}
	 */
	getPath(key = '', { avoidUnconfigurable = false, piece = true } = {}) {
		if (key === '') return { path: this.schema, route: [] };
		if (typeof key !== 'string') throw new TypeError('The value for the argument \'key\' must be a string.');
		const route = key.split('.');
		let path = this.schema;

		for (let i = 0; i < route.length; i++) {
			const currKey = route[i];
			if (typeof path[currKey] === 'undefined' || !path.hasKey(currKey)) throw `The key ${route.slice(0, i + 1).join('.')} does not exist in the current schema.`;

			if (path[currKey].type === 'Folder') {
				path = path[currKey];
			} else if (piece) {
				if (avoidUnconfigurable && !path[currKey].configurable) throw `The key ${path[currKey].path} is not configureable in the current schema.`;
				return { path: path[currKey], route: path[currKey].path.split('.') };
			}
		}

		if (piece && path.type === 'Folder') {
			const keys = path.configurableKeys;
			if (keys.length === 0) throw `This group is not configureable.`;
			throw `Please, choose one of the following keys: '${keys.join('\', \'')}'`;
		}

		return { path, route: path.path.split('.') };
	}

	/**
	 * Readies up all Configuration instances in this gateway
	 * @since 0.5.0
	 * @returns {Promise<Array<external:Collection<string, Configuration>>>}
	 * @private
	 */
	async _ready() {
		const promises = [];
		const keys = await this.provider.getKeys(this.type);
		for (let i = 0; i < keys.length; i++) {
			const structure = this.client[this.type].get(keys[i]);
			if (structure) promises.push(structure.configs.sync().then(() => this.cache.set(this.type, keys[i], structure.configs)));
		}
		return Promise.all(promises);
	}

	/**
	 * Resolves a guild
	 * @since 0.5.0
	 * @param {GatewayGuildResolvable} guild A guild resolvable.
	 * @returns {?Guild}
	 * @private
	 */
	_resolveGuild(guild) {
		if (typeof guild === 'object') {
			if (guild instanceof discord.Guild) return guild;
			if (guild instanceof discord.GuildChannel || guild instanceof discord.Message || guild instanceof discord.Role) return guild.guild;
		}
		if (typeof guild === 'string' && /^\d{17,19}$/.test(guild)) return this.client.guilds.get(guild);
		return null;
	}

	/**
	 * Make an error that can or not have a valid Guild.
	 * @since 0.5.0
	 * @param {KlasaGuild} guild The guild to get the language from.
	 * @param {(string|number)} code The code of the error.
	 * @param {(string|Error)} error The error.
	 * @returns {string}
	 * @static
	 */
	static throwError(guild, code, error) {
		if (guild && guild.language && typeof guild.language.get === 'function') return guild.language.get(code);
		return `ERROR: [${code}]: ${error}`;
	}

}

module.exports = Gateway;
