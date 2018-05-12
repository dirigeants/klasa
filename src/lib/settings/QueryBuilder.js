const { isObject, mergeDefault } = require('./util');
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
	 * @property {Function} formatDatatype The datatype formatter for the SQL database
	 */

	/**
	 * @since 0.5.0
	 * @param {Object<QueryBuilderDatatype>} datatypes The datatype to insert
	 * @param {QueryBuilderOptions} [options = {}] The default options for all datatypes plus formatDatatype
	 */
	constructor(datatypes, options = {}) {
		if (!isObject(datatypes)) throw `Expected 'datatypes' to be an object literal, got ${new Type(datatypes)}`;
		mergeDefault({ array: () => 'TEXT', resolver: null, type: null }, options);
		const { array, resolver, type } = options;

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
		 * The datatype formatter for the SQL database
		 * @type {Function}
		 * @param {string} name The column's name
		 * @param {string} datatype The column's datatype
		 * @param {string} [def = null] The default value for the column
		 * @returns {string}
		 * @private
		 */
		this.formatDatatype = options.formatDatatype || ((name, datatype, def = null) => `${name} ${datatype}${def !== null ? ` NOT NULL DEFAULT ${def}` : ''}`);
	}

	/**
	 * Get a datatype
	 * @since 0.5.0
	 * @param {string} datatype The datatype to get
	 * @returns {QueryBuilderDatatype}
	 * @example
	 * this.qb.get('string');
	 */
	get(datatype) {
		return this._datatypes[datatype] || null;
	}

	/**
	 * Resolve data from a configured dedicated resolver for the selected datatype
	 * @since 0.5.0
	 * @param {string} type The SchemaPiece's type to try to resolve
	 * @param {*} input The input to resolve
	 * @returns {*}
	 * @example
	 * this.qb.resolve('boolean', true);
	 * // -> 1 (MySQL)
	 * // -> true (PGSQL)
	 * // -> 'true' (SQLite)
	 */
	resolve(type, input) {
		const datatype = this.get(type);
		return datatype && typeof datatype.resolver === 'function' ? datatype.resolver(input) : input;
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
		if (!datatype || !datatype.type) throw `The type '${schemaPiece.type}' is unavailable, please set its definition in the constructor.`;
		if (schemaPiece.array && !datatype.array) throw `The datatype '${datatype.type}' does not support arrays.`;

		const parsedDatatype = schemaPiece.array ?
			datatype.array(typeof datatype.type === 'function' ? datatype.type(schemaPiece) : datatype.type) :
			datatype.type;
		return this.format(schemaPiece.path, parsedDatatype, schemaPiece.default);
	}

}

module.exports = QueryBuilder;
