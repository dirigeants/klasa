const Gateway = require('./Gateway');
const { parseDottedObject } = require('../util/util');
const tuplify = (string) => {
	const key = string.substring(0, string.indexOf(' '));
	return [key, string.slice(key.length + 1)];
};

class GatewaySQL extends Gateway {

	constructor(store, type, validateFunction, schema, options) {
		super(store, type, validateFunction, schema, options);
		this.parseDottedObjects = typeof options.parseDottedObjects === 'boolean' ? options.parseDottedObjects : true;
		this.sql = true;
	}

	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (hasTable === false) await this.provider.createTable(this.type, this.SQLSchema);

		const data = await this.provider.getAll(this.type);
		if (data.length > 0) for (let i = 0; i < data.length; i++) this.cache.set(this.type, data[i].id, this.parseEntry(data[i]));
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

		const { parsed } = path.array === true ?
			await this._updateArray(target, 'add', key, value, guild, { path, route }) :
			await this._updateOne(target, key, value, guild, { path, route });

		await this.provider.update(this.type, target, parsed.sql);
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

		if (array !== null) await this.provider.update(this.type, target, array !== null ? path.sql(array) : parsed.sql);
		return { value: parsed.data, path };
	}

	/**
	 * Create/Remove columns from a SQL database, by the current Schema.
	 * @param {string} key The key which is updated.
	 * @returns {Promise<boolean>}
	 */
	async updateColumns(key) {
		if (!this.provider.updateColumns) {
			this.client.emit('error', 'This SQL Provider does not seem to have a updateColumns exports. Force action cancelled.');
			return false;
		}
		const newSQLSchema = this.SQLSchema.map(tuplify);
		const keys = this.schema.getKeys(['id']);
		const columns = keys.filter(ent => ent !== key);
		await this.provider.updateColumns(this.type, columns, newSQLSchema);

		return true;
	}

	parseEntry(object) {
		if (this.parseDottedObjects === false) return object;
		return parseDottedObject(object);
	}

	get sqlSchema() {
		const schema = ['id TEXT NOT NULL UNIQUE'];
		this.schema.getSQL(schema);
		return schema;
	}

}

module.exports = GatewaySQL;
