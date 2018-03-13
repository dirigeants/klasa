const SchemaFolder = require('./SchemaFolder');
const { tryParse, deepClone } = require('../util/util');
const { resolve } = require('path');
const fs = require('fs-nextra');

class GatewayStorage {

	/**
	 * <warning>You should never create an instance of this class as it's abstract.</warning>
	 * @since 0.5.0
	 * @param {KlasaClient} client The client this GatewayStorage was created with
	 * @param {string} type The name of this GatewayStorage
	 * @param {string} [provider] The provider's name
	 * @private
	 */
	constructor(client, type, provider) {
		/**
		 * The client this GatewayStorage was created with.
		 * @since 0.5.0
		 * @name GatewayStorage#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The type of this GatewayStorage.
		 * @since 0.5.0
		 * @name GatewayStorage#type
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'type', { value: type });

		/**
		 * The name of this instance's provider.
		 * @since 0.5.0
		 * @name GatewayStorage#providerName
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'providerName', { value: provider || this.client.options.providers.default });

		/**
		 * Where the bwd folder is located at.
		 * @since 0.5.0
		 * @name GatewayStorage#baseDir
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'baseDir', { value: resolve(this.client.clientBaseDir, 'bwd') });

		/**
		 * Where the file schema is located at.
		 * @since 0.5.0
		 * @name GatewayStorage#filePath
		 * @type {string}
		 * @readonly
		 */
		Object.defineProperty(this, 'filePath', { value: resolve(this.baseDir, `${this.type}_Schema.json`) });

		/**
		 * Whether the active provider is SQL or not.
		 * @since 0.5.0
		 * @name GatewayStorage#sql
		 * @type {boolean}
		 * @readonly
		 */
		Object.defineProperty(this, 'sql', { value: this.provider.sql });

		/**
		 * @since 0.5.0
		 * @type {SchemaFolder}
		 */
		this.schema = null;

		/**
		 * @since 0.5.0
		 * @type {boolean}
		 */
		this.ready = false;
	}

	/**
	 * Get this gateway's SQL schema.
	 * @since 0.0.1
	 * @type {Array<string[]>}
	 * @readonly
	 */
	get sqlSchema() {
		const schema = [['id', 'VARCHAR(19) NOT NULL UNIQUE PRIMARY KEY']];
		this.schema.getSQL(schema);
		return schema;
	}

	/**
	 * Get the provider that manages the persistent data.
	 * @since 0.5.0
	 * @type {?Provider}
	 * @readonly
	 */
	get provider() {
		return this.client.providers.get(this.providerName) || null;
	}

	/**
	 * Get this gateway's defaults.
	 * @since 0.5.0
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		return { ...this.schema.defaults, default: true };
	}

	/**
	 * Inits the current Gateway.
	 * @since 0.5.0
	 */
	async init() {
		if (this.ready) throw new Error(`[INIT] ${this} has already initialized.`);
		await this.initSchema();
		await this.initTable();

		this.ready = true;
	}

	/**
	 * Inits the table for its use in this gateway.
	 * @since 0.5.0
	 * @private
	 */
	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (!hasTable) await this.provider.createTable(this.type, this.sql ? this.sqlSchema : undefined);
	}

	/**
	 * Inits the schema, creating a file if it does not exist, and returning the current schema or the default.
	 * @since 0.5.0
	 * @returns {SchemaFolder}
	 * @private
	 */
	async initSchema() {
		await fs.ensureDir(this.baseDir);
		const schema = await fs.readJSON(this.filePath)
			.catch(() => fs.outputJSONAtomic(this.filePath, this.defaultSchema).then(() => this.defaultSchema));
		this.schema = new SchemaFolder(this.client, this, schema, null, '');
		return this.schema;
	}

	/**
	 * Parses an entry
	 * @since 0.5.0
	 * @param {Object} entry An entry to parse
	 * @returns {Object}
	 * @private
	 */
	parseEntry(entry) {
		const object = {};
		for (const piece of this.schema.values(true)) {
			// If the key does not exist in the schema, ignore it.
			if (typeof entry[piece.path] === 'undefined') continue;

			if (piece.path.includes('.')) {
				const path = piece.path.split('.');
				let refObject = object;
				for (let a = 0; a < path.length - 1; a++) {
					const key = path[a];
					if (typeof refObject[key] === 'undefined') refObject[path[a]] = {};
					refObject = refObject[key];
				}
				refObject = GatewayStorage._parseSQLValue(entry[path[path.length - 1]], piece);
			} else {
				object[piece.path] = GatewayStorage._parseSQLValue(entry[piece.path], piece);
			}
		}

		return object;
	}

	/**
	 * Parse SQL values.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {SchemaPiece} schemaPiece The SchemaPiece which manages this value
	 * @returns {*}
	 * @private
	 */
	static _parseSQLValue(value, schemaPiece) {
		if (typeof value === 'undefined') return deepClone(schemaPiece.default);
		if (schemaPiece.array) {
			if (value === null) return deepClone(schemaPiece.default);
			if (typeof value === 'string') value = tryParse(value);
			if (Array.isArray(value)) return value.map(val => GatewayStorage._parseSQLValue(val, schemaPiece));
		} else {
			switch (schemaPiece.type) {
				case 'any':
					if (typeof value === 'string') return tryParse(value);
					break;
				case 'integer':
					if (typeof value === 'number') return value;
					if (typeof value === 'string') return parseInt(value);
					break;
				case 'boolean':
					if (typeof value === 'boolean') return value;
					if (typeof value === 'number') return value === 1;
					if (typeof value === 'string') return value === 'true';
					break;
				case 'string':
					if (typeof value === 'string' && /^\s|\s$/.test(value)) return value.trim();
				// no default
			}
		}

		return value;
	}

}

module.exports = GatewayStorage;
