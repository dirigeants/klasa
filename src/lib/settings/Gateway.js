const Schema = require('./Schema');
const { resolve } = require('path');
const fs = require('fs-nextra');

/**
 * The Gateway class that manages the data input, parsing, and output, of an entire database, while keeping a cache system sync with the changes.
 * @since 0.0.1
 */
class Gateway {

	/**
	 * @typedef  {Object} GatewayOptions
	 * @property {Provider} provider
	 * @property {CacheProvider} cache
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
	 * @typedef  {Object} GatewayParseResult
	 * @property {any}    parsed
	 * @property {object} settings
	 * @property {null}   array
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object} GatewayParseResultArray
	 * @property {any}    parsed
	 * @property {object} settings
	 * @property {any[]}  array
	 * @memberof Gateway
	 */

	/**
	 * @typedef  {Object} GatewayUpdateManyList
	 * @property {Array<Promise<any>>} promises
	 * @property {string[]} errors
	 * @memberof Gateway
	 */

	/**
	 * @typedef {(Guild|TextChannel|VoiceChannel|Message|Role)} GatewayGuildResolvable
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
	 * @param {SettingsCache} store The SettingsCache instance which initiated this instance.
	 * @param {string} type The name of this Gateway.
	 * @param {Function} validateFunction The function that validates the entries' values.
	 * @param {Object} schema The initial schema for this instance.
	 * @param {GatewayOptions} options The options for this schema.
	 */
	constructor(store, type, validateFunction, schema, options) {
		/**
		 * @type {SettingsCache}
		 */
		this.store = store;

		/**
		 * @type {string}
		 */
		this.type = type;

		/**
		 * @type {GatewayOptions}
		 */
		this.options = options;

		/**
		 * @type {Function}
		 */
		this.validate = validateFunction;

		/**
		 * @type {Object}
		 */
		this.defaultSchema = schema;

		/**
		 * @type {Schema}
		 */
		this.schema = null;

		/**
		 * @type {boolean}
		 */
		this.sql = false;
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.0.1
	 * @returns {Promise<void[]>}
	 */
	init() {
		return Promise.all([
			this.initSchema().then(schema => { this.schema = new Schema(this.client, this, schema, ''); }),
			this.initTable()
		]);
	}

	/**
	 * Inits the table for its use in this gateway.
	 * @since 0.4.0
	 */
	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) await this.provider.createTable(this.type);

		const hasCacheTable = await this.cache.hasTable(this.type);
		if (!hasCacheTable) await this.cache.createTable(this.type);

		const data = await this.provider.getAll(this.type);
		if (data.length > 0) {
			for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, data[i]);
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
	 * @returns {Object}
	 */
	getEntry(input) {
		if (input === 'default') return this.defaults;
		return this.cache.get(this.type, input) || this.defaults;
	}

	/**
	 * Create a new entry into the database with an optional content (defaults to this Gateway's defaults).
	 * @since 0.4.0
	 * @param {string} input The name of the key to create.
	 * @param {Object} [data={}] The initial data to insert.
	 * @returns {Promise<true>}
	 */
	async createEntry(input, data = this.defaults) {
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		await this.provider.create(this.type, target, data);
		await this.cache.create(this.type, target, Object.assign({ id: target }, data));
		return true;
	}

	/**
	 * Delete an entry from the database and cache.
	 * @since 0.4.0
	 * @param {string} input The name of the key to fetch and delete.
	 * @returns {Promise<true>}
	 */
	async deleteEntry(input) {
		await this.provider.delete(this.type, input);
		await this.cache.delete(this.type, input);
		return true;
	}

	/**
	 * Sync either all entries from the cache with the persistent database, or a single one.
	 * @since 0.0.1
	 * @param {(Object|string)} [input=null] An object containing a id property, like discord.js objects, or a string.
	 * @returns {Promise<void>}
	 */
	async sync(input = null) {
		if (input === null) {
			const data = await this.provider.getAll(this.type);
			if (data.length > 0) for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, data[i]);
			return true;
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		await this.cache.set(this.type, target, data);
		return true;
	}

	/**
	 * Reset a value from an entry.
	 * @since 0.0.1
	 * @param {string} target The entry target.
	 * @param {string} key The key to reset.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async reset(target, key, guild = null, avoidUnconfigurable = false) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key, { avoidUnconfigurable, piece: true });

		const { parsed, settings } = await this._reset(target, key, guild, { path, route });

		await this.provider.update(this.type, target, settings);
		return { value: parsed, path };
	}

	/**
	 *
	 * @param {string} target The key target.
	 * @param {string} key The key to edit.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayParseOptions} options The options.
	 * @private
	 * @returns {Promise<GatewayParseResult>}
	 */
	async _reset(target, key, guild, { path, route }) {
		const parsedID = path.default;
		let cache = this.getEntry(target);
		let create = false;
		if (cache.default === true) {
			create = true;
			cache = Object.assign(this.schema.getDefaults(), { id: target });
		}
		const fullObject = cache;

		for (let i = 0; i < route.length - 1; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			else cache = cache[route[i]];
		}
		cache[route[route.length - 1]] = parsedID;
		if (create) await this.createEntry(target, fullObject);
		else await this.cache.set(this.type, target, fullObject);

		return { parsed: parsedID, settings: fullObject, array: null };
	}

	/**
	 * Update a value from an entry.
	 * @since 0.4.0
	 * @param {string} target The entry target.
	 * @param {string} key The key to modify.
	 * @param {string} value The value to parse and save.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateOne(target, key, value, guild = null, avoidUnconfigurable = false) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key, { avoidUnconfigurable, piece: true });

		const { parsed, settings } = path.array === true ?
			await this._updateArray(target, 'add', key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, settings);
		return { value: parsed.data, path };
	}

	/**
	 * Update a single key
	 * @since 0.4.0
	 * @param {string} target The key target.
	 * @param {string} key The key to edit.
	 * @param {any}    value The new value.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayParseOptions} options The options.
	 * @private
	 * @returns {Promise<GatewayParseResult>}
	 */
	async _updateOne(target, key, value, guild, { path, route }) {
		if (path.array === true) throw 'This key is array type.';

		const parsed = await path.parse(value, guild);
		const parsedID = parsed.data && parsed.data.id ? parsed.data.id : parsed.data;
		let cache = this.getEntry(target);
		let create = false;
		if (cache.default === true) {
			create = true;
			cache = Object.assign(this.schema.getDefaults(), { id: target });
		}
		const fullObject = cache;

		for (let i = 0; i < route.length - 1; i++) {
			if (typeof cache[route[i]] === 'undefined') cache[route[i]] = {};
			else cache = cache[route[i]];
		}
		cache[route[route.length - 1]] = parsedID;
		if (create) await this.createEntry(target, fullObject);
		else await this.cache.set(this.type, target, fullObject);

		return { parsed, settings: fullObject, array: null };
	}

	/**
	 * Update multiple keys given a JSON object.
	 * @since 0.4.0
	 * @param {string} target The entry target.
	 * @param {Object} object A JSON object to iterate and parse.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateMany(target, object, guild = null) {
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const list = { errors: [], promises: [] };
		let cache = this.getEntry(target);
		let create = false;
		if (cache.default === true) {
			create = true;
			cache = Object.assign(this.schema.getDefaults(), { id: target });
		}
		const settings = cache;
		this._updateMany(cache, object, this.schema, guild, list);
		await Promise.all(list.promises);

		await Promise.all([
			this.cache.set(this.type, target, settings),
			create ? this.createEntry(target, settings) : this.provider.update(this.type, target, settings)
		]);
		return { settings, errors: list.errors };
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
			if (schema.has(keys[i]) === false) continue;
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
	 * Update an array from an entry.
	 * @since 0.0.1
	 * @param {string} target The entry target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to modify.
	 * @param {string} value The value to parse and save or remove.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateArray(target, action, key, value, guild = null, avoidUnconfigurable = false) {
		if (action !== 'add' && action !== 'remove') throw new TypeError('The argument \'action\' for Gateway#updateArray only accepts the strings \'add\' and \'remove\'.');
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key, { avoidUnconfigurable, piece: true });

		const { parsed, settings } = path.array === true ?
			await this._updateArray(target, action, key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, settings);
		return { value: parsed.data, path };
	}

	/**
	 * Update an array
	 * @since 0.4.0
	 * @param {string} target The key target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to edit.
	 * @param {any}    value The new value.
	 * @param {external:Guild} guild The guild to take.
	 * @param {GatewayParseOptions} options The options.
	 * @private
	 * @returns {Promise<GatewayParseResultArray>}
	 */
	async _updateArray(target, action, key, value, guild, { path, route }) {
		if (path.array === false) throw guild.language.get('COMMAND_CONF_KEY_NOT_ARRAY');

		const parsed = await path.parse(value, guild);
		const parsedID = parsed.data && parsed.data.id ? parsed.data.id : parsed.data;
		let cache = this.getEntry(target);
		let create = false;
		if (cache.default === true) {
			create = true;
			cache = Object.assign(this.schema.getDefaults(), { id: target });
		}
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

		if (create) await this.createEntry(target, fullObject);
		else await this.cache.set(this.type, target, fullObject);

		return { parsed, settings: fullObject, array: cache };
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

		for (let i = 0; i < route.length; i++) {
			if (path.keys.has(route[i]) === false) throw `The key ${route.slice(0, i).join('.')} does not exist in the current schema.`;
			if (i < route.length - 1) {
				path = path[route[i]];
				continue;
			}
			if (piece === true) {
				if (path[route[i]].type === 'Folder') throw `Please, choose one of the following keys: '${Object.keys(path).join('\', \'')}'`;
				if (avoidUnconfigurable === true && path[route[i]].configurable === false) throw `The key ${path.path} is not configureable in the current schema.`;
				path = path[route[i]];
			} else
			if (path[route[i]].type === 'Folder') {
				path = path[route[i]];
			}
		}

		return { path, route };
	}

	/**
	 * Resolves a guild
	 * @since 0.4.0
	 * @param {GatewayGuildResolvable} guild A guild resolvable
	 * @private
	 * @returns {?Guild}
	 */
	_resolveGuild(guild) {
		const constName = guild.constructor.name;
		if (constName === 'Guild') return guild;
		if (constName === 'TextChannel' || constName === 'VoiceChannel' || constName === 'Message' || constName === 'Role') return guild.guild;
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
	 * The client this SettingGateway was created with.
	 * @since 0.0.1
	 * @type {KlasaClient}
	 * @readonly
	 */
	get client() {
		return this.store.client;
	}

	/**
	 * The resolver instance this SettingGateway uses to parse the data.
	 * @since 0.0.1
	 * @type {Resolver}
	 * @readonly
	 */
	get resolver() {
		return this.store.resolver;
	}

}

module.exports = Gateway;
