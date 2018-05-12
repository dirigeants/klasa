const Provider = require('./Provider');
const { deepClone, tryParse, makeObject } = require('../util/util');
const Gateway = require('../settings/Gateway');
const { join } = require('path');

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
	 * @param {(SchemaFolder | SchemaPiece)} piece The SchemaFolder or SchemaPiece added to the schema
	 * @returns {*}
	 * @abstract
	 */
	async addColumn() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'addColumn' of ${this.constructor.name}`);
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
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'removeColumn' of ${this.constructor.name}`);
	}

	/**
	 * The updateColumn method which alters the datatype from a column.
	 * @since 0.5.0
	 * @param {string} table The table to check against
	 * @param {SchemaPiece} piece The modified SchemaPiece
	 * @returns {*}
	 * @abstract
	 */
	async updateColumn() {
		throw new Error(`[PROVIDERS] ${join(this.dir, ...this.file)} | Missing method 'updateColumn' of ${this.constructor.name}`);
	}

	/**
	 * Parse the gateway input for easier operation
	 * @since 0.5.0
	 * @param {ConfigurationUpdateResult} updated The updated entries
	 * @param {boolean} [resolve=true] Whether this should resolve the values using QueryBuider#resolve or not
	 * @returns {Array<any[]>}
	 * @protected
	 */
	parseGatewayInput(updated, resolve = true) {
		const keys = new Array(updated.length), values = new Array(updated.length);

		// If QueryBuilder is available, try to resolve the data
		if (resolve && this.qb) {
			for (let i = 0; i < updated.length; i++) {
				const entry = updated[i];
				[keys[i]] = entry.data;
				values[i] = this.qb.resolve(entry.piece);
			}
		} else {
			for (let i = 0; i < updated.length; i++) [keys[i], values[i]] = updated[i].data;
		}
		return [keys, values];
	}

	/**
	 * Parses an entry
	 * @since 0.5.0
	 * @param {(string|Gateway)} gateway The gateway with the schema to parse
	 * @param {Object} entry An entry to parse
	 * @returns {Object}
	 * @protected
	 */
	parseEntry(gateway, entry) {
		if (typeof gateway === 'string') gateway = this.client.gateways[gateway];
		if (!(gateway instanceof Gateway)) return entry;

		const object = {};
		for (const piece of gateway.schema.values(true)) {
			if (piece.path in entry[piece.path]) makeObject(piece.path, this.parseValue(entry[piece.path], piece), object);
		}

		return object;
	}

	/**
	 * Parse SQL values.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {SchemaPiece} schemaPiece The SchemaPiece which manages this value
	 * @returns {*}
	 * @protected
	 */
	parseValue(value, schemaPiece) {
		if (typeof value === 'undefined') return deepClone(schemaPiece.default);
		if (schemaPiece.array) {
			if (value === null) return deepClone(schemaPiece.default);
			if (typeof value === 'string') value = tryParse(value);
			if (Array.isArray(value)) return value.map(val => this.parseValue(val, schemaPiece));
		} else {
			const type = typeof value;
			switch (schemaPiece.type) {
				case 'any':
					if (type === 'string') return tryParse(value);
					break;
				case 'integer':
					if (type === 'number') return value;
					if (type === 'string') return Number(value);
					break;
				case 'boolean':
					if (type === 'boolean') return value;
					if (type === 'number') return value === 1;
					if (type === 'string') return value === 'true';
					break;
				case 'string':
					if (type === 'string') return /^\s|\s$/.test(value) ? value.trim() : value;
					return String(value);
				// no default
			}
		}

		return value;
	}

}

module.exports = SQLProvider;
