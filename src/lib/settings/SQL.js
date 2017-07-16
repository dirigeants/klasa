const tuplify = sss => [sss.split(' ')[0], sss.split(' ').slice(1).join(' ')];
const DefaultDataTypes = {
	String: 'TEXT',
	Integer: 'INTEGER',
	Float: 'INTEGER',
	AutoID: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE',
	Timestamp: 'DATETIME',
	AutoTS: 'DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL'
};

/* eslint-disable no-restricted-syntax */
class SQL {

	constructor(client, provider) {
		this.client = client;
		this.provider = provider;
	}

	/**
   * Generate an automatic SQL schema for a single row.
   * @param {Object} value The Schema<Value> object.
   * @returns {string}
   */
	buildSingleSQLSchema(value) {
		let constants = this.provider.CONSTANTS;
		if (!constants) {
			this.client.emit('log', 'This SQL Provider does not seem to have a CONSTANTS exports. Using built-in schema.', 'error');
			constants = DefaultDataTypes;
		}
		const selectType = schemaKey => constants[schemaKey] || 'TEXT';
		let { sanitize } = this.provider;
		if (!sanitize) {
			this.client.emit('log', 'This SQL Provider does not seem to have a sanitize exports. It might corrupt.', 'error');
			sanitize = schemaKey => `'${schemaKey}'`;
		}
		const type = value.sql || value.default ? ` DEFAULT ${sanitize(value.default)}` : '';
		return `${selectType(value.type)}${type}`;
	}

	/**
   * Generate an automatic SQL schema for all rows.
   * @param {any} schema The Schema Object.
   * @returns {string[]}
   */
	buildSQLSchema(schema) {
		const output = ['id TEXT NOT NULL UNIQUE'];
		for (const [key, value] of Object.entries(schema)) {
			output.push(`${key} ${this.buildSingleSQLSchema(key, value)}`);
		}
		return output;
	}

	/**
   * Init the deserialization keys for SQL providers.
   * @param {Object} schema The schema object.
   * @returns {void}
   */
	initDeserialize() {
		this.deserializeKeys = [];
		for (const [key, value] of Object.entries(this.schema)) {
			if (value.array === true) this.deserializeKeys.push(key);
		}
	}

	/**
   * Deserialize stringified objects.
   * @param {Object} data The GuildSettings object.
   * @return {void}
   */
	deserializer(data) {
		const deserialize = this.deserializeKeys;
		for (let i = 0; i < deserialize.length; i++) data[deserialize[i]] = JSON.parse(data[deserialize[i]]);
	}

	/**
   * Create/Remove columns from a SQL database, by the current Schema.
   * @param {Object} schema The Schema object.
   * @param {Object} defaults The Schema<Defaults> object.
   * @param {string} key The key which is updated.
   * @returns {boolean}
   */
	async updateColumns(schema, defaults, key) {
		if (!this.provider.updateColumns) {
			this.client.emit('log', 'This SQL Provider does not seem to have a updateColumns exports. Force action cancelled.', 'error');
			return false;
		}
		const newSQLSchema = this.buildSQLSchema(schema).map(tuplify);
		const keys = Object.keys(defaults);
		if (!keys.includes('id')) keys.push('id');
		const columns = keys.filter(ky => ky !== key);
		await this.provider.updateColumns('guilds', columns, newSQLSchema);
		this.initDeserialize();

		return true;
	}

	/**
   * Shortcut for Schema.
   * @readonly
   */
	get schema() {
		return this.client.schemaManager.schema;
	}

	/**
   * Shortcut for Schema<Defaults>
   * @readonly
   */
	get defaults() {
		return this.client.schemaManager.defaults;
	}

}

module.exports = SQL;
