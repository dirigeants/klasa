const Provider = require('./Provider');
const { deepClone, tryParse, makeObject, isObject, getDeepTypeName, arrayFromObject } = require('../util/util');
const Gateway = require('../settings/Gateway');

/**
 * Base class for all Klasa SQL Providers. See {@tutorial CreatingSQLProviders} for more information how to use this class
 * to build custom providers.
 * @tutorial CreatingProviders
 * @extends {Provider}
 */
class SQLProvider extends Provider {

	/**
	 * The QueryBuilder instance that builds the compatible SQL datatypes for this provider.
	 * @since 0.5.0
	 * @type {QueryBuilder}
	 * @name SQLProvider#qb
	 * @abstract
	 */

	/**
	 * Parse the raw SG's output into a tuple of keys values.
	 * @since 0.5.0
	 * @param {ConfigurationUpdateResultEntry[]} updated The raw SG's output
	 * @returns {Array<Array<*>>}
	 * @protected
	 */
	parseGatewayInput(updated) {
		const keys = new Array(updated.length), values = new Array(updated.length);
		for (let i = 0; i < updated.length; i++)[keys[i], values[i]] = updated[i].data;
		return [keys, values];
	}

	/**
	 * Helper method to abstract the overload parsing to Arrays for all SQL databases.
	 * @since 0.5.0
	 * @param {ConfigurationUpdateResultEntry[]|Array<Array<string>>|Object<string, *>} data The data to parse
	 * @returns {Array<string, *>}
	 * @protected
	 */
	parseInput(data) {
		if (Array.isArray(data)) {
			const [first] = data;
			if (first.data && first.piece) {
				// [{ data: [string, *], piece: SchemaPiece }, ...]
				return this.parseGatewayInput(data);
			}

			if (Array.isArray(first) && first.length === 2) {
				// [[string, *], ...]
				return data;
			}
		} else if (isObject(data)) {
			// Object
			return arrayFromObject(data);
		}

		throw new TypeError(`The type ${getDeepTypeName(data)} is unsupported. The supported types are ConfigurationUpdateResultEntry[], [string, *][] or Object.`);
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

	/**
	 * Parses a value to a valid string that can be used for SQL input.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @returns {string}
	 * @protected
	 */
	stringifyValue(value) {
		switch (typeof value) {
			case 'string':
				return value;
			case 'boolean':
			case 'number':
				return String(value);
			case 'object':
				return JSON.stringify(value);
			default:
				return value === null ? 'null' : '';
		}
	}

}

module.exports = SQLProvider;
