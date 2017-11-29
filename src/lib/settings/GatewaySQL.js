const Gateway = require('./Gateway');
const Settings = require('../structures/Settings');

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
	 * Inits the table for its use in this gateway.
	 * @since 0.5.0
	 */
	async initTable() {
		const hasTable = await this.provider.hasTable(this.type);
		if (hasTable === false) {
			const schema = this.sqlSchema.map(([k, v]) => `${k} ${v}`).join(', ');
			await this.provider.createTable(this.type, schema);
		}
	}

	/**
	 * Sync either all entries from the cache with the persistent SQL database, or a single one.
	 * @since 0.5.0
	 * @param {(Object|string)} [input] An object containing a id property, like discord.js objects, or a string.
	 * @returns {Promise<boolean>}
	 */
	async sync(input) {
		if (typeof input === 'undefined') {
			const data = await this.provider.getAll(this.type);
			if (data.length > 0) {
				const schemaValues = this.schema.getValues();
				for (let i = 0; i < data.length; i++) {
					const settings = new Settings(this, this._parseEntry(data[i], schemaValues));
					settings.existsInDB = true;
					this.cache.set(this.type, data[i].id, settings);
				}
			}
			return true;
		}
		const target = await this.validate(input).then(output => output && output.id ? output.id : output);
		const data = await this.provider.get(this.type, target);
		if (data) {
			const settings = new Settings(this, this._parseEntry(data));
			settings.existsInDB = true;
			this.cache.set(this.type, target, settings);
		}
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
		const { entryID, parsed, parsedID, path } = await this._reset(target, key, guild, avoidUnconfigurable);
		await this.provider.update(this.type, entryID, key, parsedID);
		return { value: parsed, path };
	}

	/**
	 * Update a value from an entry.
	 * @since 0.5.0
	 * @param {string} target The entry target.
	 * @param {string} key The key to modify.
	 * @param {any} value The value to parse and save.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateOne(target, key, value, guild = null, avoidUnconfigurable = false) {
		const { entryID, parsed, parsedID, path, array } = await this._sharedUpdateSingle(target, 'add', key, value, guild, avoidUnconfigurable);
		await this.provider.update(this.type, entryID, key, array === null ? parsedID : array);
		return { value: parsed.data, path };
	}

	/**
	 * Update an array from an entry.
	 * @since 0.0.1
	 * @param {string} target The entry target.
	 * @param {('add'|'remove')} action Whether the value should be added or removed to the array.
	 * @param {string} key The key to modify.
	 * @param {any} value The value to parse and save or remove.
	 * @param {(Guild|string)} [guild=null] A guild resolvable.
	 * @param {boolean} [avoidUnconfigurable=false] Whether the Gateway should avoid configuring the selected key.
	 * @returns {Promise<GatewayUpdateResult>}
	 */
	async updateArray(target, action, key, value, guild = null, avoidUnconfigurable = false) {
		const { entryID, parsed, parsedID, path, array } = await this._sharedUpdateSingle(target, action, key, value, guild, avoidUnconfigurable);
		await this.provider.update(this.type, entryID, key, array === null ? parsedID : array);
		return { value: parsed.data, path };
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
	 * Parses an entry
	 * @since 0.5.0
	 * @param {Object} entry An entry to parse.
	 * @param {SchemaPiece[]} [schemaValues] An array of SchemaPieces to validate.
	 * @returns {Object}
	 * @private
	 */
	_parseEntry(entry, schemaValues) {
		if (typeof schemaValues === 'undefined') schemaValues = this.schema.getValues();

		const object = {};
		for (let i = 0; i < schemaValues.length; i++) {
			const piece = schemaValues[i];
			// If the key does not exist in the schema, ignore it.
			if (typeof entry[piece.path] === 'undefined') continue;

			// Keys that are not contained in a folder.
			if (!piece.path.includes('.')) {
				if (typeof entry[piece.path] === 'undefined') object[piece.path] = piece.default;
				else object[piece.path] = piece.array || piece.type === 'any' ? JSON.parse(entry[piece.path]) : entry[piece.path];
				// Keys that are contained in a folder.
			} else {
				const path = piece.path.split('.');
				let refObject = object;
				for (let a = 0; a < path.length - 1; a++) {
					const key = path[a];
					if (typeof refObject[key] === 'undefined') refObject[key] = {};
					refObject = refObject[key];
				}
				const lastPath = path[path.length - 1];
				if (typeof refObject[lastPath] === 'undefined') refObject[lastPath] = piece.default;
				else refObject[lastPath] = piece.array || piece.type === 'any' ? JSON.parse(refObject[lastPath]) : refObject[lastPath];
			}
		}

		return object;
	}

}

module.exports = GatewaySQL;
