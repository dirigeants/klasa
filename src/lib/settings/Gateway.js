const GatewayStorage = require('./GatewayStorage');
const Configuration = require('./Configuration');
const SchemaPiece = require('./SchemaPiece');
const SchemaFolder = require('./SchemaFolder');
const { Collection, Guild, GuildChannel, Message, Role, GuildMember } = require('discord.js');
const { getIdentifier } = require('../util/util');

/**
 * <danger>You should never create a Gateway instance by yourself.
 * Please check {@link UnderstandingSettingGateway} about how to construct your own Gateway.</danger>
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @extends GatewayStorage
 */
class Gateway extends GatewayStorage {

	/**
	 * @typedef {Object} GatewayGetPathOptions
	 * @property {boolean} [avoidUnconfigurable=false] Whether the getPath should avoid unconfigurable keys
	 * @property {boolean} [piece=true] Whether the getPath should return pieces or folders
	 */

	/**
	 * @typedef {Object} GatewayGetPathResult
	 * @property {SchemaPiece} piece The piece resolved from the path
	 * @property {string[]} route The resolved path split by dots
	 */

	/**
	 * @typedef {(KlasaGuild|KlasaMessage|external:TextChannel|external:VoiceChannel|external:CategoryChannel|external:GuildMember|external:Role)} GuildResolvable
	 */

	/**
	 * @typedef {Object} GatewayJSON
	 * @property {string} type The name of this gateway
	 * @property {GatewayDriverAddOptions} options The options for this gateway
	 * @property {Object} schema The current schema
	 */

	/**
	 * @since 0.0.1
	 * @param {GatewayDriver} store The GatewayDriver instance which initiated this instance
	 * @param {string} type The name of this Gateway
	 * @param {Object} schema The initial schema for this instance
	 * @param {GatewayDriverAddOptions} options The options for this schema
	 */
	constructor(store, type, schema, options) {
		super(store.client, type, options.provider);

		/**
		 * @since 0.0.1
		 * @type {GatewayDriver}
		 */
		this.store = store;

		/**
		 * @since 0.5.0
		 * @type {GatewayDriverAddOptions}
		 */
		this.options = options;

		/**
		 * @since 0.3.0
		 * @type {Object}
		 */
		this.defaultSchema = schema;

		/**
		 * @since 0.0.1
		 * @type {external:Collection<string, Configuration>}
		 */
		this.cache = new Collection();
	}

	/**
	 * The configuration that this class should make.
	 * @since 0.5.0
	 * @type {Configuration}
	 * @readonly
	 * @private
	 */
	get Configuration() {
		return Configuration;
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
			const entry = this.cache.get(input);
			if (!entry) {
				const configs = new this.Configuration(this, { id: input });
				this.cache.set(input, configs);
				// Silently create a new entry. The new data does not matter as Configuration default all the keys.
				this.provider.create(this.type, input)
					.then(() => {
						configs._existsInDB = true;
						if (this.client.listenerCount('configCreateEntry')) this.client.emit('configCreateEntry', configs);
					})
					.catch(error => this.client.emit('error', error));
				return configs;
			}
			return entry;
		}
		return this.cache.get(input) || this.defaults;
	}

	/**
	 * Create a new entry into the database with an optional content (defaults to this Gateway's defaults).
	 * @since 0.5.0
	 * @param {string} input The name of the key to create
	 * @returns {Configuration}
	 */
	async createEntry(input) {
		const target = getIdentifier(input);
		if (!target) throw new TypeError('The selected target could not be resolved to a string.');
		const cache = this.cache.get(target);
		if (cache && cache._existsInDB) return cache;
		await this.provider.create(this.type, target);
		const configs = cache || new this.Configuration(this, { id: target });
		configs._existsInDB = true;
		if (!cache) this.cache.set(target, configs);
		if (this.client.listenerCount('configCreateEntry')) this.client.emit('configCreateEntry', configs);
		return configs;
	}

	/**
	 * Generate a new entry and add it to the cache.
	 * @since 0.5.0
	 * @param {string} id The ID of the entry
	 * @param {*} data The data to insert
	 * @returns {Configuration}
	 */
	insertEntry(id, data = {}) {
		const configs = new this.Configuration(this, { ...data, id });
		this.cache.set(id, configs);
		if (this.ready && this.schema.keyArray.length) configs.sync().catch(err => this.client.emit('error', err));
		return configs;
	}

	/**
	 * Delete an entry from the database and cache.
	 * @since 0.5.0
	 * @param {string} input The name of the key to fetch and delete
	 * @returns {boolean}
	 */
	async deleteEntry(input) {
		const configs = this.cache.get(input);
		if (!configs) return false;

		await configs.destroy();
		return true;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Object|string)} [input] An object containing a id property, like discord.js objects, or a string
	 * @param {boolean} [download] Whether the sync should download data from the database
	 * @returns {?Configuration}
	 */
	async sync(input, download) {
		if (typeof input === 'undefined') {
			if (!download) return Promise.all(this.cache.map(entry => entry.sync()));
			const entries = await this.provider.getAll(this.type);
			for (const entry of entries) {
				const cache = this.cache.get(entry);
				if (cache) {
					if (!cache._existsInDB) cache._existsInDB = true;
					cache._patch(entry);
				} else {
					const newEntry = new this.Configuration(this, entry);
					newEntry._existsInDB = true;
					this.cache.set(entry.id, newEntry);
				}
			}
			return null;
		}
		const target = getIdentifier(input);
		if (!target) throw new TypeError('The selected target could not be resolved to a string.');

		const cache = this.cache.get(target);
		if (cache) return cache.sync();

		const configs = new this.Configuration(this, { id: target });
		this.cache.set(target, configs);
		return configs.sync();
	}

	/**
	 * Resolve a path from a string.
	 * @since 0.5.0
	 * @param {string} [key=null] A string to resolve
	 * @param {GatewayGetPathOptions} [options={}] Whether the Gateway should avoid configuring the selected key
	 * @returns {?GatewayGetPathResult}
	 */
	getPath(key = '', { avoidUnconfigurable = false, piece = true, errors = true } = {}) {
		if (key === '') return { piece: this.schema, route: [] };
		const route = key.split('.');
		let { schema } = this;

		for (let i = 0; i < route.length; i++) {
			const currKey = route[i];
			if (typeof schema[currKey] === 'undefined' || !schema.has(currKey)) {
				if (errors) throw `The key ${route.slice(0, i + 1).join('.')} does not exist in the current schema.`;
				return null;
			}

			if (schema[currKey].type === 'Folder') {
				schema = schema[currKey];
			} else if (piece) {
				if (avoidUnconfigurable && !schema[currKey].configurable) {
					if (errors) throw `The key ${schema[currKey].path} is not configurable in the current schema.`;
					return null;
				}
				return { piece: schema[currKey], route: schema[currKey].path.split('.') };
			}
		}

		if (piece && schema.type === 'Folder') {
			const keys = schema.configurableKeys;
			if (!keys.length) {
				if (errors) throw `This group is not configurable.`;
				return null;
			}
			if (errors) throw `Please, choose one of the following keys: '${keys.join('\', \'')}'`;
		}

		return { piece: schema, route: schema.path.split('.') };
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

		if (download) await this.sync();
		this.ready = true;
	}

	/**
	 * Readies up all Configuration instances in this gateway
	 * @since 0.5.0
	 * @returns {Array<external:Collection<string, Configuration>>}
	 * @private
	 */
	async _ready() {
		if (!this.schema.keyArray.length || typeof this.client[this.type] === 'undefined') return null;
		const promises = [];
		const keys = await this.provider.getKeys(this.type);
		for (let i = 0; i < keys.length; i++) {
			const structure = this.client[this.type].get(keys[i]);
			if (structure) promises.push(structure.configs.sync().then(() => this.cache.set(keys[i], structure.configs)));
		}
		const results = await Promise.all(promises);
		if (!this.ready) this.ready = true;

		return results;
	}

	/**
	 * Resolves a guild
	 * @since 0.5.0
	 * @param {GuildResolvable} guild A guild resolvable
	 * @returns {?KlasaGuild}
	 * @private
	 */
	_resolveGuild(guild) {
		if (typeof guild === 'object') {
			if (guild instanceof Guild) return guild;
			if (guild instanceof GuildChannel ||
				guild instanceof Message ||
				guild instanceof Role ||
				guild instanceof GuildMember) return guild.guild;
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
		if (!this.client.shard) return;
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
	 * Get a JSON object containing the schema and options.
	 * @since 0.5.0
	 * @returns {GatewayJSON}
	 */
	toJSON() {
		return {
			type: this.type,
			options: this.options,
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

module.exports = Gateway;
