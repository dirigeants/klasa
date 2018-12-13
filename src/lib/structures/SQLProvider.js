const Provider = require('./Provider');
const { tryParse, makeObject, isObject, objectToTuples } = require('../util/util');
const Gateway = require('../settings/gateway/Gateway');
const Type = require('../util/Type');

/**
 * Base class for all Klasa SQL Providers. See {@tutorial CreatingSQLProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingSQLProviders
 * @extends {Provider}
 */
class SQLProvider extends Provider {

	/**
	 * The addColumn method which inserts/creates a new table to the database.
	 * @since 0.5.0
	 * @param {string} table The table to check against
	 * @param {(SchemaFolder | SchemaEntry)} entry The SchemaFolder or SchemaEntry added to the schema
	 * @returns {*}
	 * @abstract
	 */
	async addColumn() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'addColumn' of ${this.constructor.name}`);
	}

	/**
	 * The removeColumn method which inserts/creates a new table to the database.
	 * @since 0.5.0
	 * @param {string} table The table to check against
	 * @param {string[]} columns The column names to remove
	 * @returns {*}
	 * @abstract
	 */
	async removeColumn() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'removeColumn' of ${this.constructor.name}`);
	}

	/**
	 * The updateColumn method which alters the datatype from a column.
	 * @since 0.5.0
	 * @param {string} table The table to check against
	 * @param {SchemaEntry} entry The modified SchemaEntry
	 * @returns {*}
	 * @abstract
	 */
	async updateColumn() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'updateColumn' of ${this.constructor.name}`);
	}

	/**
	 * The getColumns method which gets the name of all columns.
	 * @since 0.5.0
	 * @param {string} table The table to check against
	 * @returns {string[]}
	 * @abstract
	 */
	async getColumns() {
		throw new Error(`[PROVIDERS] ${this.path} | Missing method 'updateColumn' of ${this.constructor.name}`);
	}

	/**
	 * Parse the gateway input for easier operation
	 * @since 0.5.0
	 * @param {(SettingsUpdateResultEntry[]|Array<Array<string>>|Object<string, *>)} [updated] The updated entries
	 * @param {boolean} [resolve=true] Whether this should resolve the values using QueryBuilder#resolve or not
	 * @returns {Array<any[]>}
	 * @protected
	 */
	parseUpdateInput(updated, resolve) {
		if (!updated) return [[], []];
		if (Array.isArray(updated)) {
			const keys = new Array(updated.length), values = new Array(updated.length);
			const [first] = updated;

			// [[k1, v1], [k2, v2], ...]
			if (Array.isArray(first) && first.length === 2) for (let i = 0; i < updated.length; i++) [keys[i], values[i]] = updated[i];

			// [{ data: [k1, v1], entry: SchemaEntry1 }, { data: [k2, v2], entry: SchemaEntry2 }, ...]
			else if ('key' in first && 'value' in first && 'entry' in first) this._parseGatewayInput(updated, keys, values, resolve);

			// Unknown overload, throw
			else throw new TypeError(`Expected void, [k, v][], SettingsFolderUpdateResultEntry[], or an object literal. Got: ${new Type(updated)}`);

			return [keys, values];
		}
		if (isObject(updated)) return objectToTuples(updated);
		throw new TypeError(`Expected void, [k, v][], SettingsFolderUpdateResultEntry[], or an object literal. Got: ${new Type(updated)}`);
	}

	/**
	 * Parses an entry
	 * @since 0.5.0
	 * @param {(string|Gateway)} gateway The gateway with the schema to parse
	 * @param {Object} raw An entry to parse
	 * @returns {Object}
	 * @protected
	 */
	parseEntry(gateway, raw) {
		if (!raw) return null;
		if (typeof gateway === 'string') gateway = this.client.gateways.get(gateway);
		if (!(gateway instanceof Gateway)) return raw;

		const object = { id: raw.id };
		for (const entry of gateway.schema.values(true)) {
			if (raw[entry.path]) makeObject(entry.path, this.parseValue(raw[entry.path], entry), object);
		}

		return object;
	}

	/**
	 * Parse SQL values.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {SchemaEntry} schemaEntry The SchemaEntry this is parsing inner keys for
	 * @returns {*}
	 * @protected
	 */
	parseValue(value, schemaEntry) {
		if (typeof value === 'undefined') return schemaEntry.default;
		if (schemaEntry.array) {
			if (value === null) return schemaEntry.default;
			if (typeof value === 'string') value = tryParse(value);
			if (!Array.isArray(value)) throw new Error(`Could not parse ${value} to an array. Returned empty array instead.`);
		} else {
			const type = typeof value;
			switch (schemaEntry.type) {
				case 'any':
					if (type === 'string') return tryParse(value);
					break;
				case 'integer':
					if (type === 'number') return value;
					if (type === 'string') return Number(value);
					if (value instanceof Buffer) return Number(value[0]);
					break;
				case 'boolean':
					if (type === 'boolean') return value;
					if (type === 'number') return value === 1;
					if (type === 'string') return value === 'true';
					if (value instanceof Buffer) return Boolean(value[0]);
					break;
				case 'string':
					if (type === 'string') return /^\s|\s$/.test(value) ? value.trim() : value;
					return String(value);
				// no default
			}
		}

		return value;
	}

	/**
	 * Parse the SettingsUpdateResultEntry[] overload
	 * @param {SettingsUpdateResultEntry[]} updated The updated keys
	 * @param {string[]} keys The keys to update
	 * @param {any[]} values The values to update
	 * @param {boolean} [resolve = true] Whether this should resolve the values using QueryBuilder#resolve or not
	 * @private
	 */
	_parseGatewayInput(updated, keys, values, resolve = true) {
		// If QueryBuilder is available, try to resolve the data
		if (resolve && this.qb) {
			for (let i = 0; i < updated.length; i++) {
				const entry = updated[i];
				keys[i] = entry.entry.path;
				values[i] = this.qb.serialize(entry.value, entry.entry);
			}
		} else {
			for (let i = 0; i < updated.length; i++) [keys[i], values[i]] = [updated[i].entry.path, updated[i].value];
		}
	}

}

module.exports = SQLProvider;
