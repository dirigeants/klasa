const tuplify = sss => [sss.split(' ')[0], sss.split(' ').slice(1).join(' ')];
const DefaultDataTypes = {
	String: 'TEXT',
	Integer: 'INTEGER',
	Float: 'INTEGER',
	AutoID: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE',
	Timestamp: 'DATETIME',
	AutoTS: 'DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL'
};

/**
 * The sql building class for sql based providers
 */
class SQL {

	/**
	 * Creates an instance of SQL.
	 * @param {KlasaClient}	   client  The Klasa Client.
	 * @param {SettingGateway} gateway The SettingGateway instance which initialized this instance.
	 */
	constructor(client, gateway) {
		/**
		 * The client this SettingsCache was created with.
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The gateway which initiated this instance.
		 * @type {SettingGateway}
		 * @readonly
		 */
		Object.defineProperty(this, 'gateway', { value: gateway });
	}

	/**
	 * Generate an automatic SQL schema for a single row.
	 * @param {Object} value The Schema<Value> object.
	 * @returns {string}
	 */
	buildSingleSQLSchema(value) {
		const selectType = schemaKey => this.constants[schemaKey] || 'TEXT';
		const type = value.sql || value.default ? ` DEFAULT ${this.sanitizer(value.default)}` : '';
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
			output.push(`${key} ${this.buildSingleSQLSchema(value)}`);
		}
		return output;
	}

	/**
	 * Init the deserialization keys for SQL providers.
	 */
	initDeserialize() {
		this.deserializeKeys = [];
		for (const [key, value] of Object.entries(this.schema)) {
			if (value.array === true) this.deserializeKeys.push(key);
		}
	}

	/**
	 * Deserialize stringified objects.
	 * @param {Object} data The Settings object.
	 */
	deserializer(data) {
		const deserialize = this.deserializeKeys;
		for (let i = 0; i < deserialize.length; i++) {
			if (typeof data[deserialize[i]] !== 'undefined') {
				data[deserialize[i]] = JSON.parse(data[deserialize[i]]);
			}
		}
	}

	/**
	 * Create/Remove columns from a SQL database, by the current Schema.
	 * @param {Object} schema   The Schema object.
	 * @param {Object} defaults The Schema<Defaults> object.
	 * @param {string} key	    The key which is updated.
	 * @returns {boolean}
	 */
	async updateColumns(schema, defaults, key) {
		if (!this.provider.updateColumns) {
			this.client.emit('error', 'This SQL Provider does not seem to have a updateColumns exports. Force action cancelled.');
			return false;
		}
		const newSQLSchema = this.buildSQLSchema(schema).map(tuplify);
		const keys = Object.keys(defaults);
		if (!keys.includes('id')) keys.push('id');
		const columns = keys.filter(ent => ent !== key);
		await this.provider.updateColumns(this.gateway.type, columns, newSQLSchema);
		this.initDeserialize();

		return true;
	}

	/**
	 * The constants this instance will use to build the SQL schemas.
	 * @type {Object}
	 * @readonly
	 */
	get constants() {
		return this.provider.CONSTANTS || DefaultDataTypes;
	}

	/**
	 * Sanitize and prepare the strings for SQL input.
	 * @type {Function}
	 * @readonly
	 */
	get sanitizer() {
		return this.provider.sanitize || (value => `'${value}'`);
	}

	/**
	 * Shortcut for Schema.
	 * @type {Object}
	 * @readonly
	 */
	get schema() {
		return this.gateway.schema;
	}

	/**
	 * Shortcut for Schema<Defaults>
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		return this.gateway.defaults;
	}

	/**
	 * The provider this SettingGateway instance uses for the persistent data operations.
	 * @type {Provider}
	 * @readonly
	 */
	get provider() {
		return this.gateway.provider;
	}

}

module.exports = SQL;
