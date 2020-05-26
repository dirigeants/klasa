import type { SchemaEntry } from '../settings/schema/SchemaEntry';
export declare class QueryBuilder extends Map<string, QueryBuilderValue> {
    /**
     * The default array handler for this instance
     * @since 0.5.0
     */
    private array;
    /**
     * The default array handler for this instance
     * @since 0.5.0
     */
    private arraySerializer;
    /**
     * The default datatype formatter for the SQL database
     * @since 0.5.0
     */
    private formatDatatype;
    /**
     * The default serializer for this instance
     * @since 0.5.0
     */
    private serializer;
    /**
     * @since 0.5.0
     * @param options The default options for all datatypes plus formatDatatype
     */
    constructor(options?: QueryBuilderEntryOptions);
    /**
     * Register a datatype to this instance
     * @since 0.5.0
     * @param name The name for the datatype
     * @param data The options for this query builder
     * @chainable
     */
    add(name: string, data: Partial<QueryBuilderDatatype>): this;
    /**
     * Remove a datatype from this instance
     * @since 0.5.0
     * @param name The name for the datatype to remove
     * @chainable
     */
    remove(name: string): this;
    /**
     * Parse a SchemaEntry for the SQL datatype creation
     * @since 0.5.0
     * @param schemaEntry The SchemaEntry to process
     * @example
     * qb.generateDatatype(this.client.gateways.get('guilds').schema.get('prefix'));
     * // type: 'string', array: true, max: 10
     * // -> prefix VARCHAR(10)[]
     */
    generateDatatype(schemaEntry: SchemaEntry): string;
    /**
     * Parses the value
     * @since 0.5.0
     * @param value The value to parse
     * @param schemaEntry The SchemaEntry instance that manages this instance
     * @param datatype The QueryBuilder datatype
     */
    serialize(value: unknown, schemaEntry: SchemaEntry, datatype?: QueryBuilderValue | undefined): string | null;
    /**
     * Returns any errors in the query builder
     * @since 0.5.0
     */
    debug(): string;
}
export interface QueryBuilderArray {
    /**
     * @since 0.6.0
     * @param entry The schema entry for context
     */
    (entry: string): string;
}
export interface QueryBuilderArraySerializer {
    /**
     * @since 0.6.0
     * @param values The values to resolve
     * @param schemaEntry The SchemaEntry that manages this instance
     * @param serializer The single-element serializer
     */
    (values: readonly unknown[], schemaEntry: SchemaEntry, resolver: QueryBuilderSerializer): string;
}
export interface QueryBuilderSerializer {
    /**
     * @since 0.6.0
     * @param value The value to serialize
     * @param schemaEntry The SchemaEntry that manages this instance
     */
    (value: unknown, schemaEntry: SchemaEntry): string;
}
export interface QueryBuilderFormatDatatype {
    /**
     * @since 0.6.0
     * @param name The name of the SQL column
     * @param datatype The SQL datatype
     * @param def The default value
     */
    (name: string, datatype: string, def?: string | null): string;
}
export interface QueryBuilderType {
    /**
     * @since 0.6.0
     * @param entry The SchemaEntry to determine the SQL type from
     */
    (schemaEntry: SchemaEntry): string;
}
export interface QueryBuilderEntryOptions {
    /**
     * The default array handler for this instance
     * @since 0.6.0
     */
    array?: QueryBuilderArray;
    /**
     * The default array handler for this instance
     * @since 0.6.0
     */
    arraySerializer?: QueryBuilderArraySerializer;
    /**
     * The default datatype formatter for the SQL database
     * @since 0.6.0
     */
    formatDatatype?: QueryBuilderFormatDatatype;
    /**
     * The default serializer for this instance
     * @since 0.6.0
     */
    serializer?: QueryBuilderSerializer;
}
export interface QueryBuilderDatatype extends QueryBuilderEntryOptions {
    /**
     * The SQL datatype
     * @since 0.6.0
     */
    type?: QueryBuilderType | string;
    /**
     * The QueryBuilder primitive this extends to
     * @since 0.6.0
     */
    extends?: string;
}
export declare type QueryBuilderValue = Required<QueryBuilderDatatype>;
