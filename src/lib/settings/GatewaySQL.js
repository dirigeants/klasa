const Gateway = require('./Gateway');
const { tryParse } = require('../util/util');

/**
 * An extended Gateway that overrides several methods for SQL parsing.
 * @extends Gateway
 */
class GatewaySQL extends Gateway {

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
				refObject = GatewaySQL._parseSQLValue(entry[path[path.length - 1]], piece);
			} else {
				object[piece.path] = GatewaySQL._parseSQLValue(entry[piece.path], piece);
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
	 * @static
	 */
	static _parseSQLValue(value, schemaPiece) {
		if (typeof value !== 'undefined') {
			if (schemaPiece.array) {
				if (typeof value === 'string') value = tryParse(value);
				if (Array.isArray(value)) value.map(val => GatewaySQL.parseSQLValue(val, schemaPiece));
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
			}
		}
		return schemaPiece.array ? schemaPiece.default.slice(0) : schemaPiece.default;
	}

}

module.exports = GatewaySQL;
