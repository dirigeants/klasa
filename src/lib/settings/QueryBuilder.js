const { isNumber, isObject } = require('../util/util');
const { mergeDefault } = require('../util/util');
const constants = require('../util/constants');
const QueryType = require('./QueryType');
const QUOTE_REGEXP = /'/g;
const DEFAULT_MAKESTRING_LITERAL = (str) => `'${str.replace(QUOTE_REGEXP, "''")}'`;

/**
 * The QueryBuilder manager that abstracts SQL datatype creation per-provider
 */
class QueryBuilder {

	/**
	 * @typedef {Object} QueryBuilderType
	 * @property {string} name The name of the datatype
	 * @property {*} default The default(s) values for the datatype
	 */

	/**
	 * @typedef {Object} QueryBuilderOptions
	 * @property {Function} [makeStringLiteral] The function to make literal strings
	 * @property {Function} [arrayWrap] The function to turn a primitive datatype into an array of such datatype
	 */

	/**
	 * Create a new instance of QueryBuilder to manage QueryTypes for a specific SQL database to improve cross-compatibility.
	 * @since 0.5.0
	 * @param {KlasaClient} client The Client that manages this instance
	 * @param {Object<string, QueryBuilderType>} types The custom types for this instance
	 * @param {QueryBuilderOptions} [options = {}] The options for this instance
	 * @example
	 * // Create a QueryBuilder for PostgreSQL
	 * new QueryBuilder(this.client, {
	 *     // Declare the boolean type, with the datatype name as "BOOL"
	 *     // and defaults false and true
	 *     BOOLEAN: { name: 'BOOL', default: [false, true] },
	 *     // Declare the float type, defaults to 0
	 *     FLOAT: { name: 'DOUBLE PRECISION', default: 0 },
	 *     // Declare the integer type, defaults to 0
	 *     INTEGER: { name: 'INTEGER', default: 0 },
	 *     // Declare the text type, defaults to NULL
	 *     TEXT: { name: 'TEXT' },
	 *     // Declare the varchar type, defaults to NULL, the property of
	 *     // size tells QB to use VARCHAR(MAX_LENGTH)
	 *     VARCHAR: { name: 'VARCHAR', size: true }
	 * }, {
	 *     // When using arrays, PG converts INTEGER to INTEGER[]. So we want
	 *     // to append '[]' at the end of the type
	 *     arrayWrap: (type) => `${type}[]`
	 * });
	 */
	constructor(client, types, { makeStringLiteral = DEFAULT_MAKESTRING_LITERAL, arrayWrap = null } = {}) {
		/**
		 * The Client that manages this instance
		 * @since 0.5.0
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The types used for the SQL database
		 * @since 0.5.0
		 * @type {Object<string, QueryBuilderType>} The types for this instance
		 */
		this.types = mergeDefault(constants.DEFAULTS.SQL, types);

		/**
		 * The function to make string literals with the character escaping
		 * @since 0.5.0
		 * @type {Function}
		 */
		this.makeStringLiteral = makeStringLiteral;

		/**
		 * A function that wraps the type to an array.
		 * @since 0.5.0
		 * @type {?Function}
		 */
		this.arrayWrap = arrayWrap;

		/**
		 * The Map that holds custom resolvers.
		 * @since 0.5.0
		 * @type {Map<string, Function>}
		 */
		this.customResolvers = new Map();
	}

	/**
	 * Create a new QueryType instance.
	 * @since 0.5.0
	 * @returns {QueryType}
	 * @example
	 * // Create a datatype with the contraints NOT NULL
	 * // and DEFAULT 10 for a key with type INTEGER.
	 * const query = this.providers.default.qb
	 *     // Create a new instance of QueryType
	 *     .create()
	 *     // Set the type to INTEGER
	 *     .setType('INTEGER')
	 *     // Set the QueryType as non-nullable
	 *     .setNotNull()
	 *     // Set default to 10
	 *     .default(10)
	 *     // Set the key as an array of integers
	 *     .setArray()
	 *     // Parse the QueryType into a string
	 *     .toString();
	 *
	 * console.log(query);
	 * // -> 'INTEGER NOT NULL DEFAULT 10'
	 */
	create() {
		return new QueryType(this);
	}

	/**
	 * Parse a value.
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @returns {string}
	 * @private
	 */
	_parseValue(value) { // eslint-disable-line complexity
		const type = typeof value;
		switch (this.type) {
			case 'BOOLEAN':
				if (type === 'boolean') return this.types.BOOLEAN.default[Number(value)];
				if (type === 'string') return this.types.BOOLEAN.default[Number(value === 'true')];
				if (type === 'number') return this.types.BOOLEAN.default[Number(value !== 0)];
				return this.types.BOOLEAN.default[0];
			case 'SMALLINT':
			case 'INTEGER':
			case 'BIGINT':
				if (type === 'number') return Number.isInteger(value) ? value : Math.floor(value);
				if (type === 'string') return Number(value) || 0;
				return 0;
			case 'REAL':
			case 'FLOAT':
				return isNumber(value) ? value : 0;
			case 'JSON':
				return this.makeStringLiteral(isObject(value) ? JSON.stringify(value) : '{}');
			case 'TEXT':
			case 'VARCHAR':
				if (type === 'string') return this.makeStringLiteral(value);
				if (type === 'object') return this.makeStringLiteral(JSON.stringify(value));
				return this.makeStringLiteral(String(value));
			default: {
				const customResolver = this.customResolvers.get(this.type);
				return customResolver ? customResolver(this, value) : value;
			}
		}
	}

}

module.exports = QueryBuilder;
