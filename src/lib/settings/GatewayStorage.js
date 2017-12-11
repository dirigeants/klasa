const { tryParse } = require('../util/util');
const { resolve } = require('path');
const Schema = require('./Schema');
const fs = require('fs-nextra');

class GatewayStorage {

	/**
	 * @since 0.5.0
	 * @param {KlasaClient} client The client this GatewayStorage was created with.
	 * @param {string} type The name of this GatewayStorage.
	 * @param {string} [provider] The provider's name.
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
		Object.defineProperty(this, 'providerName', { value: provider || this.client.options.provider.engine || 'json' });

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
		Object.defineProperty(this, 'filePath', { value: resolve(this.baseDir, `${this.type}.json`) });

		/**
		 * Whether the active provider is SQL or not.
		 * @since 0.5.0
		 * @name GatewayStorage#baseDir
		 * @type {boolean}
		 * @readonly
		 */
		Object.defineProperty(this, 'sql', { value: this.provider.sql });

		/**
		 * @since 0.5.0
		 * @type {Schema}
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
		const schema = [['id', 'VARCHAR(19) NOT NULL UNIQUE']];
		this.schema.getSQL(schema);
		return schema;
	}

	/**
	 * Get the provider that manages the persistent data.
	 * @since 0.5.0
	 * @type {Provider}
	 * @readonly
	 */
	get provider() {
		return this.client.providers.get(this.providerName);
	}

	/**
	 * Get this gateway's defaults.
	 * @since 0.5.0
	 * @type {Object}
	 * @readonly
	 */
	get defaults() {
		return Object.assign(this.schema.defaults, { default: true });
	}

	/**
	 * Inits the current Gateway.
	 * @since 0.5.0
	 */
	async init() {
		if (this.ready) throw new Error('KlasaGatewayStorage already inited.');
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
		if (!hasTable) await this.provider.createTable(this.type, this.sql ? this.sqlSchema.map(([k, v]) => `${k} ${v}`).join(', ') : undefined);
	}

	/**
	 * Inits the schema, creating a file if it does not exist, and returning the current schema or the default.
	 * @since 0.5.0
	 * @returns {Promise<Schema>}
	 * @private
	 */
	async initSchema() {
		await fs.ensureDir(this.baseDir);
		const schema = await fs.readJSON(this.filePath)
			.catch(() => fs.outputJSONAtomic(this.filePath, this.defaultSchema).then(() => this.defaultSchema));
		this.schema = new Schema(this.client, this, schema, null, '');
		return this.schema;
	}

	/**
	 * Parses an entry
	 * @since 0.5.0
	 * @param {Object} entry An entry to parse.
	 * @returns {Object}
	 * @private
	 */
	parseEntry(entry) {
		const object = {};
		for (const piece of this.schema.getValues()) {
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
	 * Make an error that can or not have a valid Guild.
	 * @since 0.5.0
	 * @param {KlasaGuild} guild The guild to get the language from.
	 * @param {(string|number)} code The code of the error.
	 * @param {(string|Error)} error The error.
	 * @returns {string}
	 * @private
	 * @static
	 */
	static throwError(guild, code, error) {
		if (guild && guild.language && typeof guild.language.get === 'function') return guild.language.get(code);
		return `ERROR: [${code}]: ${error}`;
	}

	/**
	 * Parse SQL values.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {SchemaPiece} schemaPiece The SchemaPiece which manages this value
	 * @returns {*}
	 * @private
	 * @static
	 */
	static _parseSQLValue(value, schemaPiece) {
		if (typeof value !== 'undefined') {
			if (schemaPiece.array) {
				if (value === null) return schemaPiece.default.slice(0);
				if (typeof value === 'string') value = tryParse(value);
				if (Array.isArray(value)) value = value.map(val => GatewayStorage._parseSQLValue(val, schemaPiece));
				return value;
			}
			if (schemaPiece.type === 'any') {
				if (typeof value === 'string') return tryParse(value);
			} else if (schemaPiece.type === 'integer') {
				if (typeof value === 'string') return parseInt(value);
				if (typeof value === 'number') return value;
			} else if (schemaPiece.type === 'boolean') {
				if (typeof value === 'boolean') return value;
				if (typeof value === 'number') return value === 1;
				if (typeof value === 'string') return value === 'true';
			} else if (schemaPiece.type === 'string') {
				if (typeof value === 'string' && /^\s|\s$/.test(value)) return value.trim();
				return value;
			}

			return value;
		}
		return schemaPiece.array ? schemaPiece.default.slice(0) : schemaPiece.default;
	}

}

module.exports = GatewayStorage;
