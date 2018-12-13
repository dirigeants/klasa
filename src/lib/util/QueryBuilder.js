const { mergeDefault } = require('./util');
const { DEFAULTS: { QUERYBUILDER } } = require('./constants');

/**
 * @extends {Map<string, Required<QueryBuilderDatatype>>}
 */
class QueryBuilder extends Map {

	/**
	 * @typedef {Function} QueryBuilderArray
	 * @param {schemaEntry} entry The schema entry for context
	 * @returns {string}
	 */

	/**
	 * @typedef {Function} QueryBuilderArraySerializer
	 * @param {Array<*>} values The values to resolve
	 * @param {QueryBuilderSerializer} serializer The single-element serializer
	 * @returns {string}
	 */

	/**
	 * @typedef {Function} QueryBuilderSerializer
	 * @param {*} value The value to resolve
	 * @param {SchemaEntry} entry The schema entry for context
	 * @returns {string}
	 */

	/**
	 * @typedef {Function} QueryBuilderFormatDatatype
	 * @param {string} name The column's name
	 * @param {string} datatype The column's datatype
	 * @param {string} [def = null] The default value for the column
	 * @returns {string}
	 */

	/**
	 * @typedef {Function} QueryBuilderType
	 * @param {SchemaEntry} entry The schema entry for dynamic processing
	 * @returns {string}
	 */

	/**
	 * @typedef {Object} QueryBuilderEntryOptions
	 * @property {QueryBuilderArray} [array] The default array handler for this instance
	 * @property {QueryBuilderArraySerializer} [arraySerializer] The default array handler for this instance
	 * @property {QueryBuilderFormatDatatype} [formatDatatype] The default datatype formatter for the SQL database
	 * @property {QueryBuilderSerializer} [serializer] The default serializer for this instance
	 */

	/**
	 * @typedef {QueryBuilderEntryOptions} QueryBuilderDatatype
	 * @property {QueryBuilderType|string} type The name of the datatype, e.g. VARCHAR, DATE, or BIT
	 */

	/**
	 * @since 0.5.0
	 * @param {QueryBuilderEntryOptions} [options = {}] The default options for all datatypes plus formatDatatype
	 */
	constructor(options = {}) {
		super();
		mergeDefault(options, QUERYBUILDER.queryBuilderOptions);

		/**
		 * The default array handler for this instance
		 * @since 0.5.0
		 * @type {QueryBuilderArray}
		 * @private
		 */
		this.array = options.array;

		/**
		 * The default array handler for this instance
		 * @since 0.5.0
		 * @type {QueryBuilderArraySerializer}
		 * @private
		 */
		this.arraySerializer = options.arraySerializer;

		/**
		 * The default datatype formatter for the SQL database
		 * @since 0.5.0
		 * @type {QueryBuilderFormatDatatype}
		 * @private
		 */
		this.formatDatatype = options.formatDatatype;

		/**
		 * The default serializer for this instance
		 * @since 0.5.0
		 * @type {QueryBuilderSerializer}
		 * @private
		 */
		this.serializer = options.serializer;

		// Register all default datatypes
		for (const [name, data] of QUERYBUILDER.datatypes) this.add(name, data);
	}

	/**
	 * Register a datatype to this instance
	 * @since 0.5.0
	 * @param {string} name The name for the datatype
	 * @param {string|QueryBuilderDatatype} data The options for this query builder
	 * @returns {this}
	 * @chainable
	 */
	add(name, data) {
		this.set(name, mergeDefault(this, typeof data === 'string' ? { type: data } : data));
		return this;
	}

	/**
	 * Parse a SchemaEntry for the SQL datatype creation
	 * @since 0.5.0
	 * @param {SchemaEntry} schemaEntry The SchemaEntry to process
	 * @returns {string}
	 * @example
	 * qb.generateDatatype(this.client.gateways.get('guilds').schema.get('prefix'));
	 * // type: 'string', array: true, max: 10
	 * // -> prefix VARCHAR(10)[]
	 */
	generateDatatype(schemaEntry) {
		const datatype = this.get(schemaEntry.type) || null;
		const parsedDefault = this.serialize(schemaEntry.default, schemaEntry, datatype);
		const type = typeof datatype.type === 'function' ? datatype.type(schemaEntry) : datatype.type;
		const parsedDatatype = schemaEntry.array ? datatype.array(type) : type;
		return datatype.formatDatatype(schemaEntry.path, parsedDatatype, parsedDefault);
	}

	/**
	 * Parses the value
	 * @since 0.5.0
	 * @param {*} value The value to parse
	 * @param {schemaEntry} schemaEntry The SchemaEntry instance that manages this instance
	 * @param {Required<QueryBuilderDatatype>} datatype The QueryBuilder datatype
	 * @returns {string}
	 */
	serialize(value, schemaEntry, datatype = this.get(schemaEntry.type)) {
		if (!datatype) throw new Error(`The type '${schemaEntry.type}' is unavailable, please set its definition.`);
		if (schemaEntry.array && !datatype.array) throw new Error(`The datatype '${datatype.type}' does not support arrays.`);

		// If value is null, there is nothing to resolve.
		if (value === null) return 'null';

		return schemaEntry.array ?
			datatype.arraySerializer(value, schemaEntry, datatype.serializer) :
			datatype.serializer(value, schemaEntry);
	}

}

module.exports = QueryBuilder;
