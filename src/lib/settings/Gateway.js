const GatewayStorage = require('./GatewayStorage');
const Configuration = require('../structures/Configuration');
const SchemaPiece = require('./SchemaPiece');
const SchemaFolder = require('./SchemaFolder');
const discord = require('discord.js');

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class Gateway extends GatewayStorage {

	/**
	 * @typedef {Object} GatewayOptions
	 * @property {Provider} [provider]
	 * @property {CacheProvider} [cache]
	 * @property {boolean} [nice=false]
	 * @memberof Gateway
	 */

	/**
	 * @typedef {(KlasaGuild|KlasaMessage|external:TextChannel|external:VoiceChannel|external:CategoryChannel|external:Member|external:GuildChannel|external:Role)} GatewayGuildResolvable
	 * @memberof Gateway
	 */

	/**
	 * @typedef {Object} GatewayPathOptions
	 * @property {boolean} [avoidUnconfigurable=false]
	 * @property {boolean} [piece=true]
	 * @memberof Gateway
	 */

	/**
	 * @typedef {Object} GatewayPathResult
	 * @property {SchemaPiece} path
	 * @property {string[]} route
	 * @memberof Gateway
	 */

	/**
	 * @since 0.0.1
	 * @param {GatewayDriver} store The GatewayDriver instance which initiated this instance
	 * @param {string} type The name of this Gateway
	 * @param {Function} validateFunction The function that validates the entries' values
	 * @param {Object} schema The initial schema for this instance
	 * @param {GatewayOptions} options The options for this schema
	 */
	constructor(store, type, validateFunction, schema, options) {
		super(store.client, type, options.provider);

		/**
		 * @since 0.0.1
		 * @type {GatewayDriver}
		 */
		this.store = store;

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
	}

	/**
	 * Get the cache-provider that manages the cache data.
	 * @since 0.0.1
	 * @type {Provider}
	 * @readonly
	 */
	get cache() {
		return this.client.providers.get(this.options.cache);
	}

	/**
	 * @since 0.0.1
	 * @type {SettingResolver}
	 * @name Gateway#resolver
	 * @readonly
	 */
	get resolver() {
		return this.store.resolver;
	}

	/**
	 * Get an entry from the cache.
	 * @since 0.5.0
	 * @param {string} input The key to get from the cache
	 * @param {boolean} [create=false] Whether SG should create a new instance of Configuration in the background
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
	 * @param {string} input The name of the key to create
	 * @returns {Promise<Configuration>}
	 */
	async createEntry(input) {
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const cache = this.cache.get(this.type, target);
		if (cache && cache.existsInDB) return cache;
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
	 * @param {string} id The ID of the entry
	 * @param {*} data The data to insert
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
	 * @param {string} input The name of the key to fetch and delete
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
	 * @param {(Object|string)} [input] An object containing a id property, like discord.js objects, or a string
	 * @param {boolean} [download] Whether the sync should download data from the database
	 * @returns {Promise<*>}
	 */
	async sync(input, download) {
		if (typeof input === 'undefined') {
			if (!download) return Promise.all(this.cache.getValues(this.type).map(entry => entry.sync()));
			const entries = await this.provider.getAll(this.type);
			for (const entry of entries) {
				const cache = this.cache.get(this.type, entry);
				if (cache) {
					if (!cache.existsInDB) cache.existsInDB = true;
					cache._patch(entry);
				} else {
					const newEntry = new Configuration(this, entry);
					newEntry.existsInDB = true;
					this.cache.set(this.type, entry.id, newEntry);
				}
			}
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const cache = this.cache.get(this.type, target);
		if (cache) return cache.sync();

		const configs = new Configuration(this, { id: target });
		this.cache.set(this.type, target, configs);
		return configs.sync();
	}

	/**
	 * Resolve a path from a string.
	 * @since 0.5.0
	 * @param {string} [key=null] A string to resolve
	 * @param {GatewayPathOptions} [options={}] Whether the Gateway should avoid configuring the selected key
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
				if (avoidUnconfigurable && !path[currKey].configurable) throw `The key ${path[currKey].path} is not configurable in the current schema.`;
				return { path: path[currKey], route: path[currKey].path.split('.') };
			}
		}

		if (piece && path.type === 'Folder') {
			const keys = path.configurableKeys;
			if (keys.length === 0) throw `This group is not configurable.`;
			throw `Please, choose one of the following keys: '${keys.join('\', \'')}'`;
		}

		return { path, route: path.path.split('.') };
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.0.1
	 * @param {boolean} [download=true] Whether this Gateway should download the data from the database
	 * @private
	 */
	async init(download = true) {
		if (this.ready) throw new Error(`[INIT] ${this} has already initialized.`);

		await this.initSchema();
		await this.initTable();
		if (!this.cache.hasTable(this.type)) this.cache.createTable(this.type);

		if (download) await this.sync();
		this.ready = true;
	}

	/**
	 * Readies up all Configuration instances in this gateway
	 * @since 0.5.0
	 * @returns {Promise<Array<external:Collection<string, Configuration>>>}
	 * @private
	 */
	async _ready() {
		if (typeof this.client[this.type] === 'undefined') return null;
		const promises = [];
		const keys = await this.provider.getKeys(this.type);
		for (let i = 0; i < keys.length; i++) {
			const structure = this.client[this.type].get(keys[i]);
			if (structure) promises.push(structure.configs.sync().then(() => this.cache.set(this.type, keys[i], structure.configs)));
		}
		const results = await Promise.all(promises);
		if (!this.ready) this.ready = true;

		return results;
	}

	/**
	 * Resolves a guild
	 * @since 0.5.0
	 * @param {GatewayGuildResolvable} guild A guild resolvable
	 * @returns {?KlasaGuild}
	 * @private
	 */
	_resolveGuild(guild) {
		if (typeof guild === 'object') {
			if (guild instanceof discord.Guild) return guild;
			if (guild instanceof discord.GuildChannel || guild instanceof discord.Message || guild instanceof discord.Role || guild instanceof discord.GuildMember) return guild.guild;
		}
		if (typeof guild === 'string' && /^\d{17,19}$/.test(guild)) return this.client.guilds.get(guild);
		return null;
	}

	/**
	 * Sync this shard's schema.
	 * @since 0.5.0
	 * @param {string[]} path The key's path
	 * @param {Object} data The data to insert
	 * @param {('add'|'delete'|'update')} action Whether the piece got added or removed
	 * @param {boolean} force Whether the key got added with force or not
	 * @private
	 */
	async _shardSync(path, data, action, force) {
		if (!this.client.sharded) return;
		const parsed = typeof data === 'string' ? JSON.parse(data) : data;
		let route = this.schema;
		const key = path.pop();
		for (const pt of path) route = route[pt];
		let piece;
		if (action === 'add') {
			if (parsed.type === 'Folder') piece = route[key] = new SchemaFolder(this.client, this, parsed, route, key);
			else piece = route[key] = new SchemaPiece(this.client, this, parsed, route, key);
		} else if (action === 'delete') {
			piece = route[key];
			delete route[key];
		} else {
			route[key]._patch(parsed);
		}
		if (force) await route.force(action, key, piece);
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

module.exports = Gateway;
