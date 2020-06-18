import { mergeDefault, deepClone } from '@klasa/utils';
import { OPTIONS, DATATYPES } from './constants';
import type { SchemaEntry } from '../settings/schema/SchemaEntry';

export class QueryBuilder extends Map<string, QueryBuilderValue> {

	/**
	 * The default array handler for this instance
	 * @since 0.5.0
	 */
	private array: QueryBuilderArray;

	/**
	 * The default array handler for this instance
	 * @since 0.5.0
	 */
	private arraySerializer: QueryBuilderArraySerializer;

	/**
	 * The default datatype formatter for the SQL database
	 * @since 0.5.0
	 */
	private formatDatatype: QueryBuilderFormatDatatype;

	/**
	 * The default serializer for this instance
	 * @since 0.5.0
	 */
	private serializer: QueryBuilderSerializer;

	/**
	 * @since 0.5.0
	 * @param options The default options for all datatypes plus formatDatatype
	 */
	public constructor(options: QueryBuilderEntryOptions = {}) {
		super();
		const resolved = mergeDefault(OPTIONS, options);

		this.array = resolved.array;
		this.arraySerializer = resolved.arraySerializer;
		this.formatDatatype = resolved.formatDatatype;
		this.serializer = resolved.serializer;

		// Register all default datatypes
		for (const [name, data] of DATATYPES) this.add(name, data);
	}

	/**
	 * Register a datatype to this instance
	 * @since 0.5.0
	 * @param name The name for the datatype
	 * @param data The options for this query builder
	 * @chainable
	 */
	public add(name: string, data: Partial<QueryBuilderDatatype>): this {
		// Resolve extends by pointing to another datatype
		if (typeof data.extends === 'string') {
			const datatype = this.get(data.extends);
			if (datatype) this.set(name, Object.assign(Object.create(datatype), data));
			else throw new Error(`"extends" in datatype ${name} does not point to a registered datatype.`);
		} else {
			const datatype = this.get(name);
			if (datatype) {
				Object.assign(datatype, data);
			} else {
				this.set(name, mergeDefault({
					array: this.array,
					arraySerializer: this.arraySerializer,
					extends: undefined as QueryBuilderDatatype['extends'],
					formatDatatype: this.formatDatatype,
					serializer: this.serializer,
					type: undefined as QueryBuilderDatatype['type']
				}, deepClone(data)));
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
	public remove(name: string): this {
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
	public generateDatatype(schemaEntry: SchemaEntry): string {
		const datatype = this.get(schemaEntry.type) ?? null;
		if (!datatype) throw new Error('A datatype was generated without an existing query generator.');

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
	public serialize(value: unknown, schemaEntry: SchemaEntry, datatype: QueryBuilderValue | undefined = this.get(schemaEntry.type)): string | null {
		if (!datatype) throw new Error(`The type '${schemaEntry.type}' is unavailable, please set its definition.`);
		if (schemaEntry.array && !datatype.array) throw new Error(`The datatype '${datatype.type}' does not support arrays.`);

		// If value is null, there is nothing to resolve.
		if (value === null) return null;

		return schemaEntry.array ?
			datatype.arraySerializer(value as readonly unknown[], schemaEntry, datatype.serializer) :
			datatype.serializer(value, schemaEntry);
	}

	/**
	 * Returns any errors in the query builder
	 * @since 0.5.0
	 */
	public debug(): string {
		const errors = [];
		for (const [name, datatype] of this) {
			if (!['string', 'function'].includes(typeof datatype.type)) errors.push(`"type" in datatype ${name} must be a string or a function, got: ${typeof datatype.type}`);
			if (typeof datatype.array !== 'function') errors.push(`"array" in datatype ${name} must be a function, got: ${typeof datatype.array}`);
			if (typeof datatype.arraySerializer !== 'function') errors.push(`"arraySerializer" in datatype ${name} must be a function, got: ${typeof datatype.arraySerializer}`);
			if (typeof datatype.formatDatatype !== 'function') errors.push(`"formatDatatype" in datatype ${name} must be a function, got: ${typeof datatype.formatDatatype}`);
			if (typeof datatype.serializer !== 'function') errors.push(`"serializer" in datatype ${name} must be a function, got: ${typeof datatype.serializer}`);
		}
		return errors.join('\n');
	}

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

export type QueryBuilderValue = Required<QueryBuilderDatatype>;
