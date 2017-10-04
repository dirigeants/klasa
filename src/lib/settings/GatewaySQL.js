const Gateway = require('./Gateway');
const tuplify = (string) => {
	const key = string.substring(0, string.indexOf(' '));
	return [key, string.slice(key.length + 1)];
};

class GatewaySQL extends Gateway {

	constructor(store, type, validateFunction, schema, provider) {
		super(store, type, validateFunction, schema, provider);
		this.sql = true;
	}

	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (hasTable === false) await this.provider.createTable(this.type, this.SQLSchema);

		const data = await this.provider.getAll(this.type);
		if (data.length > 0) for (const key of data) super.set(key.id, key);
	}

	async reset(target, key, guild) {
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { path, route } = this._getPath(key);
		const parsed = await path.parse(path.default, guild);
		await this._reset(target, route, parsed);
		await this.provider.updateOne(this.type, parsed.sql, target);
		return parsed;
	}

	async updateOne(target, key, value, guild) {
		target = await this.validate(target).then(output => output && output.id ? output.id : output);
		const { entryID, parsed } = await this._updateOne(target, key, value, guild);
		await this.provider.updateOne(this.type, parsed.sql, entryID);
		return parsed;
	}

	/**
	 * Create/Remove columns from a SQL database, by the current Schema.
	 * @param {string} key	    The key which is updated.
	 * @returns {boolean}
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

	get SQLSchema() {
		return this.schema.getSQL(['id TEXT NOT NULL UNIQUE']);
	}

}

module.exports = GatewaySQL;
