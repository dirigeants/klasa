const { isObject, mergeDefault } = require('./util');
const { DEFAULTS: { DATATYPES } } = require('./constants');
const Type = require('./Type');

class QueryBuilder {

	/**
	 * @typedef {Object} QueryBuilderDatatype
	 * @property {Function} [array = () => 'TEXT'] A function that converts the current datatype into an array
	 * @property {Function} [resolver = null] The resolver to convert JS objects into compatible data for the SQL database. This can be used to prevent SQL injections
	 * @property {string} type The name of the datatype, e.g. VARCHAR, DATE, or BIT
	 */

	/**
	 * @typedef {QueryBuilderDatatype} QueryBuilderOptions
	 * @property {Function} [formatDatatype] The datatype formatter for the SQL database
	 * @property {Function} [arrayResolver] The specialized resolver for array keys
	 */

	/**
	 * @since 0.5.0
	 * @param {Object<QueryBuilderDatatype>} datatypes The datatype to insert
	 * @param {QueryBuilderOptions} [options = {}] The default options for all datatypes plus formatDatatype
	 */
	constructor(datatypes = {}, { array = () => 'TEXT', resolver = null, type = null, arrayResolver, formatDatatype } = {}) {
		if (!isObject(datatypes)) throw `Expected 'datatypes' to be an object literal, got ${new Type(datatypes)}`;

		// Default the options for QueryBuilderDatatype
		mergeDefault(DATATYPES, datatypes);

		// Merge defaults on all keys
		for (const key of Object.keys(datatypes)) {
			const value = datatypes[key];
			if (!isObject(value)) throw `Expected 'datatypes.${key}' to be an object literal, got ${new Type(value)}`;
			mergeDefault({ array, resolver, type }, value);
		}

		/**
		 * The defined datatypes for this instance
		 * @since 0.5.0
		 * @readonly
		 * @private
		 */
		Object.defineProperty(this, '_datatypes', { value: Object.seal(datatypes) });

		/**
		 * The array resolver for the SQL database
		 * @type {Function}
		 * @param {Array<*>} values The values to resolve
		 * @param {Function} resolver The normal resolver
		 * @returns {string}
		 * @private
		 */
		this.arrayResolver = arrayResolver || ((values) => `'${JSON.stringify(values)}'`);

		/**
		 * The datatype formatter for the SQL database
		 * @type {Function}
		 * @param {string} name The column's name
		 * @param {string} datatype The column's datatype
		 * @param {string} [def = null] The default value for the column
		 * @returns {string}
		 * @private
		 */
		this.formatDatatype = formatDatatype || ((name, datatype, def = null) => `${name} ${datatype}${def !== null ? ` NOT NULL DEFAULT ${def}` : ''}`);
	}

	/**
	 * Get a datatype
	 * @since 0.5.0
	 * @param {string} type The datatype to get
	 * @returns {QueryBuilderDatatype}
	 * @example
	 * this.qb.get('string');
	 */
	get(type) {
		return this._datatypes[type] || null;
	}

	/**
	 * Parse a SchemaPiece for the SQL datatype creation
	 * @since 0.5.0
	 * @param {schemaPiece} schemaPiece The SchemaPiece to process
	 * @returns {string}
	 * @example
	 * this.qb.parse(this.client.gateways.guilds.schema.prefix);
	 * // type: 'string', array: true, max: 10
	 * // -> prefix VARCHAR(10)[]
	 */
	parse(schemaPiece) {
		const datatype = this.get(schemaPiece.type);
		const parsedDefault = this.parseValue(schemaPiece.default, schemaPiece, datatype);
		const type = typeof datatype.type === 'function' ? datatype.type(schemaPiece) : datatype.type;
		const parsedDatatype = schemaPiece.array ? datatype.array(type) : type;
		return this.formatDatatype(schemaPiece.path, parsedDatatype, parsedDefault);
	}

	/**
	 * Parses the value
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {schemaPiece} schemaPiece The SchemaPiece instance that manages this instance
	 * @param {QueryBuilderDatatype} datatype The QueryBuilder datatype
	 * @returns {string}
	 */
	parseValue(value, schemaPiece, datatype = this.get(schemaPiece.type)) {
		if (!datatype) throw new Error(`The type '${schemaPiece.type}' is unavailable, please set its definition in the constructor.`);
		if (schemaPiece.array && !datatype.array) throw new Error(`The datatype '${datatype.type}' does not support arrays.`);

		// If value is null, there is nothing to resolve.
		if (value === null) return null;

		return schemaPiece.array ?
			this.arrayResolver(value, schemaPiece, datatype.resolver || (() => value)) :
			typeof datatype.resolver === 'function' ? datatype.resolver(value, schemaPiece) : value;
	}

}

module.exports = QueryBuilder;
