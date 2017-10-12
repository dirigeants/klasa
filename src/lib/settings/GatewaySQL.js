const Gateway = require('./Gateway');
const Schema = require('./Schema');
const { stringIsObject } = require('../util/util');

class GatewaySQL extends Gateway {

	constructor(store, type, validateFunction, schema, options) {
		super(store, type, validateFunction, schema, options);
		this.parseDottedObjects = typeof options.parseDottedObjects === 'boolean' ? options.parseDottedObjects : true;
		this.sql = true;
		this.sqlEntryParser = [];
	}

	/**
	 * Inits the table and the schema for its use in this gateway.
	 * @returns {Promise<void[]>}
	 */
	async init() {
		await this.initSchema().then(schema => { this.schema = new Schema(this.client, this, schema, ''); });
		await this.initTable();
		this.initEntryParser();
		await this.sync();
		return [];
	}

	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (hasTable === false) await this.provider.createTable(this.type, this.sqlSchema);
	}

	initEntryParser() {
		const values = [];
		this.schema.getValues(values);

		for (let i = 0; i < values.length; i++) {
			this.sqlEntryParser.push([
				values[i].path,
				values[i].default,
				values[i].array ?
					(value) => stringIsObject(value) ? JSON.parse(value) : value :
					(value) => value
			]);
		}
	}

	parseEntry(entry) {
		if (this.parseDottedObjects === false) return entry;

		const object = {};
		for (let i = 0; i < this.sqlEntryParser.length; i++) {
			const [path, def, fn] = this.sqlEntryParser[i];
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

	/**
	 * Sync either all entries from the cache with the persistent SQL database, or a single one.
	 * @param {(Object|string)} [input=null] An object containing a id property, like discord.js objects, or a string.
	 * @returns {Promise<void>}
	 */
	async sync(input = null) {
		if (input === null) {
			const data = await this.provider.getAll(this.type);
			if (data.length > 0) for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, this.parseEntry(data[i]));
			return true;
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		await this.cache.set(this.type, target, this.parseEntry(data));
		return true;
	}

	/**
	 * Reset a value from an entry.
	 * @param {string} target The entry target.
	 * @param {string} key The key to reset.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<{ value: any, path: SchemaPiece }>}
	 */
	async reset(target, key, guild = null, avoidUnconfigurable = false) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key, { avoidUnconfigurable, piece: true });

		const { parsed } = await this._reset(target, key, guild, { path, route });

		await this.provider.update(this.type, target, path.sql(parsed));
		return { value: parsed, path };
	}

	/**
	 * Update a value from an entry.
	 * @param {string} target The entry target.
	 * @param {string} key The key to modify.
	 * @param {string} value The value to parse and save.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<{ value: any, path: SchemaPiece }>}
	 */
	async updateOne(target, key, value, guild = null, avoidUnconfigurable = false) {
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key, { avoidUnconfigurable, piece: true });

		const { parsed, array } = path.array === true ?
			await this._updateArray(target, 'add', key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, array !== null ? path.sql(array) : parsed.sql);
		return { value: parsed.data, path };
	}

	/**
	 * Update an array from an entry.
	 * @param {string} target The entry target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to modify.
	 * @param {string} value The value to parse and save or remove.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<{ value: any, path: SchemaPiece }>}
	 */
	async updateArray(target, action, key, value, guild = null, avoidUnconfigurable = false) {
		if (action !== 'add' && action !== 'remove') throw new TypeError('The argument \'action\' for Gateway#updateArray only accepts the strings \'add\' and \'remove\'.');
		if (typeof key !== 'string') throw new TypeError(`The argument key must be a string. Received: ${typeof key}`);
		guild = this._resolveGuild(guild || target);
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this.getPath(key, { avoidUnconfigurable, piece: true });

		const { parsed, array } = path.array === true ?
			await this._updateArray(target, action, key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, array !== null ? path.sql(array) : parsed.sql);
		return { value: parsed.data, path };
	}

	/**
	 * Create/Remove columns from a SQL database, by the current Schema.
	 * @param {('add'|'remove'|'update')} action The action to perform.
	 * @param {string} key The key to remove or update.
	 * @param {string} [dataType] The column's datatype.
	 * @returns {Promise<any>}
	 */
	async updateColumns(action, key, dataType = null) {
		if (typeof action !== 'string') throw new TypeError('The parameter \'action\' for GatewaySQL#updateColumns must be a string.');
		if (typeof key !== 'string') throw new TypeError('The parameter \'key\' for GatewaySQL#updateColumns must be a string.');
		if ((action === 'add' || action === 'update') && (dataType === null || typeof dataType !== 'string' || dataType.length === 0)) {
			throw new Error(`The parameter 'dataType' for GatewaySQL#updateColumns must be a valid string when 'action' is '${action}'.`);
		}

		switch (action) {
			case 'add': return this.provider.addColumn(action, key, dataType);
			case 'remove': return this.provider.removeColumn(action, key);
			case 'update': return this.provider.updateColumn(action, key, dataType);
			default: throw new TypeError('GatewaySQL#updateColumns only accept \'add\', \'remove\' or \'update\' as a value.');
		}
	}

	get sqlSchema() {
		const schema = [['id', 'TEXT NOT NULL UNIQUE']];
		this.schema.getSQL(schema);
		return schema;
	}

}

module.exports = GatewaySQL;
