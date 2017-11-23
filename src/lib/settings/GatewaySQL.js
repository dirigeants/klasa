const Gateway = require('./Gateway');
const Schema = require('./Schema');
const Settings = require('../structures/Settings');
const { stringIsObject } = require('../util/util');

/**
 * An extended Gateway that overrides several methods for SQL parsing.
 * @extends Gateway
 */
class GatewaySQL extends Gateway {

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
	 * @typedef {Object} EntryParser
	 * @property {string} path
	 * @property {any} default
	 * @property {Function} fn
	 */

	/**
	 * @since 0.4.0
	 * @param {SettingsCache} store The SettingsCache instance which initiated this instance.
	 * @param {string} type The name of this Gateway.
	 * @param {Function} validateFunction The function that validates the entries' values.
	 * @param {Object} schema The initial schema for this instance.
	 * @param {GatewayOptions} options The options for this schema.
	 */
	constructor(store, type, validateFunction, schema, options) {
		super(store, type, validateFunction, schema, options);

		/**
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.parseDottedObjects = typeof options.parseDottedObjects === 'boolean' ? options.parseDottedObjects : true;

		/**
		 * @since 0.0.1
		 * @type {boolean}
		 * @readonly
		 */
		Object.defineProperty(this, 'sql', { value: true });

		/**
		 * @since 0.4.0
		 * @type {EntryParser[]}
		 */
		this.sqlEntryParser = [];
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @since 0.4.0
	 * @returns {Promise<void[]>}
	 */
	async init() {
		const schema = await this.initSchema();
		this.schema = new Schema(this.client, this, schema, '');

		await this.initTable();
		this._initEntryParser();
		await this.sync();
		return [];
	}

	/**
	 * Inits the table for its use in this gateway.
	 * @since 0.4.0
	 */
	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (hasTable === false) await this.provider.createTable(this.type, this.sqlSchema);
	}

	/**
	 * Sync either all entries from the cache with the persistent SQL database, or a single one.
	 * @since 0.4.0
	 * @param {(Object|string)} [input] An object containing a id property, like discord.js objects, or a string.
	 * @returns {Promise<boolean>}
	 */
	async sync(input) {
		if (typeof input === 'undefined') {
			const data = await this.provider.getAll(this.type);
			if (data.length > 0) for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, new Settings(this, this._parseEntry(data[i])));
			return true;
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		this.cache.set(this.type, target, new Settings(this, new Settings(this, this._parseEntry(data))));
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
		const { parsed, parsedID } = await this._reset(target, key, guild, { path, route });

		await this.provider.update(this.type, target, key, parsedID);
		return { value: parsed, path };
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

		const { parsed, array, parsedID } = path.array === true ?
			await this._updateArray(target, 'add', key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, key, array === null ? parsedID : array);
		return { value: parsed.data, path };
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

		const { parsed, array, parsedID } = path.array === true ?
			await this._updateArray(target, action, key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, key, array === null ? parsedID : array);
		return { value: parsed.data, path };
	}

	/**
	 * Get this gateway's SQL schema.
	 * @since 0.0.1
	 * @type {Array<string[]>}
	 * @readonly
	 */
	get sqlSchema() {
		const schema = [['id', 'TEXT NOT NULL UNIQUE']];
		this.schema.getSQL(schema);
		return schema;
	}

	/**
	 * Initializes the SQL -> NoSQL sanitizer.
	 * @since 0.4.0
	 * @private
	 */
	_initEntryParser() {
		const values = [];
		this.schema.getValues(values);

		for (let i = 0; i < values.length; i++) {
			const piece = values[i];
			this.sqlEntryParser.push({
				path: piece.path,
				def: piece.default,
				fn: piece.array ?
					(value) => piece.type === 'any' && stringIsObject(value) ? JSON.parse(value) : value :
					(value) => value
			});
		}
	}

	/**
	 * Parses an entry
	 * @since 0.4.0
	 * @param {Object} entry An entry to parse.
	 * @private
	 * @returns {Object}
	 */
	_parseEntry(entry) {
		if (this.parseDottedObjects === false) return entry;

		const object = {};
		for (let i = 0; i < this.sqlEntryParser.length; i++) {
			const { path, def, fn } = this.sqlEntryParser[i];
			if (path.indexOf('.') === -1) {
				if (typeof entry[path] === 'undefined') {
					object[path] = def;
					continue;
				}
				object[path] = fn(entry[path]);
				continue;
			}

			const pathes = path.split('.');
			let tempPath = object;
			for (let a = 0; a < pathes.length - 1; a++) {
				if (typeof tempPath[pathes[a]] === 'undefined') tempPath[pathes[a]] = {};
				tempPath = tempPath[pathes[a]];
			}
			tempPath[pathes[pathes.length - 1]] = fn(entry[path]);
		}

		return object;
	}

}

module.exports = GatewaySQL;
