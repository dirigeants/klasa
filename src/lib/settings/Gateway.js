const Schema = require('./Schema');
const Settings = require('../structures/Settings');
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
	 * @typedef  {Object} GatewayUpdateResult
	 * @property {any} value
	 * @property {SchemaPiece} path
	 */

	/**
	 * @typedef  {Object} GatewayParseOptions
	 * @property {string}   path
	 * @property {string[]} route
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object}   GatewayParseResult
	 * @property {any}      parsed
	 * @property {any}      parsedID
	 * @property {object}   settings
	 * @property {null}     array
	 * @property {string}   path
	 * @property {string[]} route
	 * @property {string}   entryID
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object}   GatewayParseResultArray
	 * @property {any}      parsed
	 * @property {any}      parsedID
	 * @property {object}   settings
	 * @property {any[]}    array
	 * @property {string}   path
	 * @property {string[]} route
	 * @property {string}   entryID
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object} GatewayUpdateManyList
	 * @property {Array<Promise<any>>} promises
	 * @property {string[]} errors
	 * @memberof Gateway
	 */

	/**
	 * @typedef {(external:Guild|external:TextChannel|external:VoiceChannel|external:Message|external:Role)} GatewayGuildResolvable
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
	 * @param {SettingsCache} store The SettingsCache instance which initiated this instance.
	 * @param {string} type The name of this Gateway.
	 * @param {Function} validateFunction The function that validates the entries' values.
	 * @param {Object} schema The initial schema for this instance.
	 * @param {GatewayOptions} options The options for this schema.
	 */
	constructor(store, type, validateFunction, schema, options) {
		/**
		 * @since 0.0.1
		 * @type {SettingsCache}
		 */
		this.store = store;

		/**
		 * @since 0.3.0
		 * @type {string}
		 */
		this.type = type;

		/**
		 * @since 0.4.0
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
		 * @since 0.0.1
		 * @type {boolean}
		 * @readonly
		 */
		Object.defineProperty(this, 'sql', { value: false });
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.0.1
	 */
	async init() {
		await this.initSchema().then(schema => { this.schema = new Schema(this.client, this, schema, ''); });
		await this.initTable();
	}

	/**
	 * Inits the table for its use in this gateway.
	 * @since 0.4.0
	 */
	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) await this.provider.createTable(this.type);

		const hasCacheTable = this.cache.hasTable(this.type);
		if (!hasCacheTable) this.cache.createTable(this.type);

		const data = await this.provider.getAll(this.type);
		if (data.length > 0) {
			for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, new Settings(this, data[i]));
		}
	}

	/**
	 * Inits the schema, creating a file if it does not exist, and returning the current schema or the default.
	 * @since 0.4.0
	 * @returns {Promise<Object>}
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
	 * @since 0.4.0
	 * @param {string} input The key to get from the cache.
	 * @returns {(Settings|Object)}
	 */
	getEntry(input) {
		if (input === 'default') return this.defaults;
		return this.cache.get(this.type, input) || this.defaults;
	}

	/**
	 * Create a new entry into the database with an optional content (defaults to this Gateway's defaults).
	 * @since 0.4.0
	 * @param {string} input The name of the key to create.
	 * @returns {Promise<Settings>}
	 */
	async createEntry(input) {
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = this.schema.getDefaults();
		await this.provider.create(this.type, target, data);
		data.id = target;
		const settings = new Settings(this, data);
		this.cache.set(this.type, target, settings);
		return settings;
	}

	/**
	 * Delete an entry from the database and cache.
	 * @since 0.4.0
	 * @param {string} input The name of the key to fetch and delete.
	 * @returns {Promise<true>}
	 */
	async deleteEntry(input) {
		await this.provider.delete(this.type, input);
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
				for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, new Settings(this, data[i]));
			}
			return true;
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		this.cache.set(this.type, target, new Settings(this, data));
		return true;
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.0.1
	 * @param {string} target The entry target.
	 * @param {string} key The key to reset.
	 * @param {(Guild|string)} [guild] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async reset(target, key, guild, avoidUnconfigurable = false) {
		const { entryID, settings, parsed, path } = await this._reset(target, key, guild, avoidUnconfigurable);
		await this.provider.update(this.type, entryID, settings);
		return { value: parsed, path };
	}

	/**
	 * Update a value from an entry.
	 * @since 0.4.0
	 * @param {string} target The entry target.
	 * @param {string} key The key to modify.
	 * @param {string} value The value to parse and save.
	 * @param {(Guild|string)} [guild] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateOne(target, key, value, guild, avoidUnconfigurable = false) {
		const { entryID, settings, parsed, path } = await this._sharedUpdateSingle(target, 'add', key, value, guild, avoidUnconfigurable);
		await this.provider.update(this.type, entryID, settings);
		return { value: parsed.data, path };
	}

	/**
	 * Update an array from an entry.
	 * @since 0.0.1
	 * @param {string} target The entry target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to modify.
	 * @param {string} value The value to parse and save or remove.
	 * @param {(Guild|string)} [guild] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateArray(target, action, key, value, guild, avoidUnconfigurable = false) {
		const { entryID, settings, parsed, path } = await this._sharedUpdateSingle(target, action, key, value, guild, avoidUnconfigurable);
		await this.provider.update(this.type, entryID, settings);
		return { value: parsed.data, path };
	}

	/**
	 * Update multiple keys given a JSON object.
	 * @since 0.4.0
	 * @param {string} target The entry target.
	 * @param {Object} object A JSON object to iterate and parse.
	 * @param {(Guild|string)} [guild] A guild resolvable.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateMany(target, object, guild) {
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const list = { errors: [], promises: [] };
		let cache = this.cache.get(this.type, target);

		// Handle entry creation if it does not exist.
		if (!cache) cache = await this.createEntry(target);
		const settings = cache;
		this._updateMany(cache, object, this.schema, guild, list);
		await Promise.all(list.promises);

		await this.provider.update(this.type, target, settings);
		return { settings, errors: list.errors };
	}

	/**
	 * Resolve a path from a string.
	 * @since 0.4.0
	 * @param {string} [key=null] A string to resolve.
	 * @param {GatewayPathOptions} [options={}] Whether the Gateway should avoid configuring the selected key.
	 * @returns {GatewayPathResult}
	 */
	getPath(key = '', { avoidUnconfigurable = false, piece = true } = {}) {
		if (key === '') return { path: this.schema, route: [] };
		if (typeof key !== 'string') throw new TypeError('The value for the argument \'key\' must be a string.');
		const route = key.split('.');
		let path = this.schema;

		for (let i = 0; i < route.length - 1; i++) {
			if (typeof path[route[i]] === 'undefined' ||
				path.hasKey(route[i]) === false) throw `The key ${route.slice(0, i + 1).join('.')} does not exist in the current schema.`;
			path = path[route[i]];
		}

		const lastPath = path[route[route.length - 1]];
		if (typeof lastPath === 'undefined') throw `The key ${key} does not exist in the current schema.`;
		if (piece === true) {
			path = lastPath;
			if (path.type === 'Folder') {
				const keys = path.configurableKeys;
				if (keys.length === 0) throw `This group is not configureable.`;
				throw `Please, choose one of the following keys: '${keys.join('\', \'')}'`;
			}
			if (avoidUnconfigurable === true && path.configurable === false) throw `The key ${path.path} is not configureable in the current schema.`;
			// Requires a folder
		} else if (lastPath.type === 'Folder') {
			path = lastPath;
		}

		return { path, route };
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.0.1
	 * @param {string} target The entry target.
	 * @param {string} key The key to reset.
	 * @param {(Guild|string)} guild A guild resolvable.
	 * @param {boolean} avoidUnconfigurable Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayParseResult>}
	 */
	async _reset(target, key, guild, avoidUnconfigurable) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const pathData = this.getPath(key, { avoidUnconfigurable, piece: true });
		return this._parseReset(target, key, guild, pathData);
	}

	/**
	 * Parse the data for reset.
	 * @since 0.4.0
	 * @param {string} target The key target.
	 * @param {string} key The key to edit.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayParseOptions} options The options.
	 * @returns {Promise<GatewayParseResult>}
	 * @private
	 */
	async _parseReset(target, key, guild, { path, route }) {
		const parsedID = path.default;
		let cache = this.cache.get(this.type, target);

		// Handle entry creation if it does not exist.
		if (!cache) cache = await this.createEntry(target);
		const settings = cache;

		for (let i = 0; i < route.length - 1; i++) cache = cache[route[i]] || {};
		cache[route[route.length - 1]] = parsedID;

		return { entryID: target, parsed: parsedID, parsedID, settings, array: null, path, route };
	}

	/**
	 * Update a single key
	 * @since 0.4.0
	 * @param {string} target The key target.
	 * @param {string} key The key to edit.
	 * @param {any} value The new value.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayParseOptions} options The options.
	 * @returns {Promise<GatewayParseResult>}
	 * @private
	 */
	async _parseUpdateOne(target, key, value, guild, { path, route }) {
		if (path.array === true) throw 'This key is array type.';

		const parsed = await path.parse(value, guild);
		const parsedID = parsed.data && parsed.data.id ? parsed.data.id : parsed.data;
		let cache = this.cache.get(this.type, target);

		// Handle entry creation if it does not exist.
		if (!cache) cache = await this.createEntry(target);
		const settings = cache;

		for (let i = 0; i < route.length - 1; i++) cache = cache[route[i]] || {};
		cache[route[route.length - 1]] = parsedID;

		return { entryID: target, parsed, parsedID, settings, array: null, path, route };
	}

	/**
	 * Update an array
	 * @since 0.4.0
	 * @param {string} target The key target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to edit.
	 * @param {any} value The new value.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayParseOptions} options The options.
	 * @returns {Promise<GatewayParseResultArray>}
	 * @private
	 */
	async _parseUpdateArray(target, action, key, value, guild, { path, route }) {
		if (path.array === false) throw Gateway.throwError(guild, 'COMMAND_CONF_KEY_NOT_ARRAY', 'The key is not an array.');

		const parsed = await path.parse(value, guild);
		const parsedID = parsed.data && parsed.data.id ? parsed.data.id : parsed.data;
		let cache = this.cache.get(this.type, target);

		// Handle entry creation if it does not exist.
		if (!cache) cache = await this.createEntry(target);
		const fullObject = cache;

		for (let i = 0; i < route.length; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			cache = cache[route[i]];
		}
		if (action === 'add') {
			if (cache.includes(parsedID)) throw `The value ${parsedID} for the key ${path.path} already exists.`;
			cache.push(parsedID);
		} else {
			const index = cache.indexOf(parsedID);
			if (index === -1) throw `The value ${parsedID} for the key ${path.path} does not exist.`;
			cache.splice(index, 1);
		}

		return { entryID: target, parsed, parsedID, settings: fullObject, array: cache, path, route };
	}

	/**
	 * Update an array
	 * @since 0.4.0
	 * @param {string} target The key target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to edit.
	 * @param {any}    value The new value.
	 * @param {external:Guild} guild The guild to take.
	 * @param {boolean} avoidUnconfigurable Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayParseResultArray>}
	 * @private
	 */
	async _sharedUpdateSingle(target, action, key, value, guild, avoidUnconfigurable) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const pathData = this.getPath(key, { avoidUnconfigurable, piece: true });
		return pathData.path.array === true ?
			await this._parseUpdateArray(target, action, key, value, guild, pathData) :
			await this._parseUpdateOne(target, key, value, guild, pathData);
	}

	/**
	 * Update many keys in a single query.
	 * @since 0.4.0
	 * @param {Object} cache The key target.
	 * @param {Object} object The key to edit.
	 * @param {Schema} schema The new value.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayUpdateManyList} list The options.
	 * @private
	 */
	_updateMany(cache, object, schema, guild, list) {
		const keys = Object.keys(object);
		for (let i = 0; i < keys.length; i++) {
			if (schema.hasKey(keys[i]) === false) continue;
			if (schema[keys[i]].type === 'Folder') {
				this._updateMany(cache[keys[i]], object[keys[i]], schema[keys[i]], guild, list);
				continue;
			}
			list.promises.push(schema[keys[i]].parse(object[keys[i]], guild)
				.then(result => { cache[keys[i]] = result && result.data && result.data.id ? result.data.id : result.data; })
				.catch(error => list.errors.push([schema[keys[i]].path, error])));
		}
	}

	/**
	 * Resolves a guild
	 * @since 0.4.0
	 * @param {GatewayGuildResolvable} guild A guild resolvable.
	 * @returns {?Guild}
	 * @private
	 */
	_resolveGuild(guild) {
		if (typeof guild === 'object') {
			if (guild instanceof discord.Guild) return guild;
			if (guild instanceof discord.Channel ||
				guild instanceof discord.Message) return guild.guild;
		}
		if (typeof guild === 'string' && /^\d{17,19}$/.test(guild)) return this.client.guilds.get(guild);
		return null;
	}

	/**
	 * Get the cache-provider that manages the cache data.
	 * @since 0.0.1
	 * @type {CacheProvider}
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
	 * @since 0.4.0
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		return Object.assign(this.schema.defaults, { default: true });
	}

	/**
	 * The client this Gateway was created with.
	 * @since 0.0.1
	 * @type {KlasaClient}
	 * @readonly
	 */
	get client() {
		return this.store.client;
	}

	/**
	 * The resolver instance this Gateway uses to parse the data.
	 * @since 0.0.1
	 * @type {Resolver}
	 * @readonly
	 */
	get resolver() {
		return this.store.resolver;
	}

	static throwError(guild, code, error) {
		if (guild && guild.language && typeof guild.language.get === 'function') return guild.language.get(code);
		return `ERROR: [${code}]: ${error}`;
	}

}

module.exports = Gateway;
