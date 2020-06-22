"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const utils_1 = require("@klasa/utils");
const constants_1 = require("./constants");
class QueryBuilder extends Map {
    /**
     * @since 0.5.0
     * @param options The default options for all datatypes plus formatDatatype
     */
    constructor(options = {}) {
        super();
        const resolved = utils_1.mergeDefault(constants_1.OPTIONS, options);
        this.array = resolved.array;
        this.arraySerializer = resolved.arraySerializer;
        this.formatDatatype = resolved.formatDatatype;
        this.serializer = resolved.serializer;
        // Register all default datatypes
        for (const [name, data] of constants_1.DATATYPES)
            this.add(name, data);
    }
    /**
     * Register a datatype to this instance
     * @since 0.5.0
     * @param name The name for the datatype
     * @param data The options for this query builder
     * @chainable
     */
    add(name, data) {
        // Resolve extends by pointing to another datatype
        if (typeof data.extends === 'string') {
            const datatype = this.get(data.extends);
            if (datatype)
                this.set(name, Object.assign(Object.create(datatype), data));
            else
                throw new Error(`"extends" in datatype ${name} does not point to a registered datatype.`);
        }
        else {
            const datatype = this.get(name);
            if (datatype) {
                Object.assign(datatype, data);
            }
            else {
                this.set(name, utils_1.mergeDefault({
                    array: this.array,
                    arraySerializer: this.arraySerializer,
                    extends: undefined,
                    formatDatatype: this.formatDatatype,
                    serializer: this.serializer,
                    type: undefined
                }, utils_1.deepClone(data)));
            }
        }
        return this;
    }
    /**
     * Remove a datatype from this instance
     * @since 0.5.0
     * @param name The name for the datatype to remove
     * @chainable
     */
    remove(name) {
        this.delete(name);
        return this;
    }
    /**
     * Parse a SchemaEntry for the SQL datatype creation
     * @since 0.5.0
     * @param schemaEntry The SchemaEntry to process
     * @example
     * qb.generateDatatype(this.client.gateways.get('guilds').schema.get('prefix'));
     * // type: 'string', array: true, max: 10
     * // -> prefix VARCHAR(10)[]
     */
    generateDatatype(schemaEntry) {
        var _a;
        const datatype = (_a = this.get(schemaEntry.type)) !== null && _a !== void 0 ? _a : null;
        if (!datatype)
            throw new Error('A datatype was generated without an existing query generator.');
        const parsedDefault = this.serialize(schemaEntry.default, schemaEntry, datatype);
        const type = typeof datatype.type === 'function' ? datatype.type(schemaEntry) : datatype.type;
        const parsedDatatype = schemaEntry.array ? datatype.array(type) : type;
        return datatype.formatDatatype(schemaEntry.key, parsedDatatype, parsedDefault);
    }
    /**
     * Parses the value
     * @since 0.5.0
     * @param value The value to parse
     * @param schemaEntry The SchemaEntry instance that manages this instance
     * @param datatype The QueryBuilder datatype
     */
    serialize(value, schemaEntry, datatype = this.get(schemaEntry.type)) {
        if (!datatype)
            throw new Error(`The type '${schemaEntry.type}' is unavailable, please set its definition.`);
        if (schemaEntry.array && !datatype.array)
            throw new Error(`The datatype '${datatype.type}' does not support arrays.`);
        // If value is null, there is nothing to resolve.
        if (value === null)
            return null;
        return schemaEntry.array ?
            datatype.arraySerializer(value, schemaEntry, datatype.serializer) :
            datatype.serializer(value, schemaEntry);
    }
    /**
     * Returns any errors in the query builder
     * @since 0.5.0
     */
    debug() {
        const errors = [];
        for (const [name, datatype] of this) {
            if (!['string', 'function'].includes(typeof datatype.type))
                errors.push(`"type" in datatype ${name} must be a string or a function, got: ${typeof datatype.type}`);
            if (typeof datatype.array !== 'function')
                errors.push(`"array" in datatype ${name} must be a function, got: ${typeof datatype.array}`);
            if (typeof datatype.arraySerializer !== 'function')
                errors.push(`"arraySerializer" in datatype ${name} must be a function, got: ${typeof datatype.arraySerializer}`);
            if (typeof datatype.formatDatatype !== 'function')
                errors.push(`"formatDatatype" in datatype ${name} must be a function, got: ${typeof datatype.formatDatatype}`);
            if (typeof datatype.serializer !== 'function')
                errors.push(`"serializer" in datatype ${name} must be a function, got: ${typeof datatype.serializer}`);
        }
        return errors.join('\n');
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map