import { isNumber, isFunction } from '@klasa/utils';
import type { Client } from '@klasa/core';
import type { Schema } from './Schema';
import type { SchemaFolder } from './SchemaFolder';
import type { Serializer, SerializerUpdateContext } from '../../structures/Serializer';

export class SchemaEntry {

	/**
	 * The KlasaClient for this SchemaEntry.
	 */
	public client: Client | null = null;

	/**
	 * The schema that manages this instance.
	 */
	public readonly parent: Schema | SchemaFolder;

	/**
	 * The key of this entry relative to its parent.
	 */
	public readonly key: string;

	/**
	 * The absolute key of this entry.
	 */
	public readonly path: string;

	/**
	 * The type of data this entry manages.
	 */
	public type: string;

	/**
	 * Whether or not this entry should hold an array of data.
	 */
	public array: boolean;

	/**
	 * The default value this entry will set when reverting a setting back to or when the key was not set.
	 */
	public default: unknown;

	/**
	 * The minimum value for this entry.
	 */
	public minimum: number | null;

	/**
	 * The maximum value for this entry.
	 */
	public maximum: number | null;

	/**
	 * Whether this entry should inclusively or exclusively check minimum and maximum on key validation.
	 */
	public inclusive: boolean;

	/**
	 * Whether or not this entry should be configurable by the configuration command.
	 */
	public configurable: boolean;

	/**
	 * The filter to use for this entry when resolving.
	 */
	public filter: SchemaEntryFilterFunction | null;

	/**
	 * Whether or not values managed by this entry should be resolved.
	 */
	public shouldResolve: boolean;

	public constructor(parent: Schema | SchemaFolder, key: string, type: string, options: SchemaEntryOptions = {}) {
		this.client = null;
		this.parent = parent;
		this.key = key;
		this.path = this.parent.path.length === 0 ? this.key : `${this.parent.path}.${this.key}`;
		this.type = type.toLowerCase();
		this.array = typeof options.array === 'undefined' ? typeof options.default === 'undefined' ? false : Array.isArray(options.default) : options.array;
		this.default = typeof options.default === 'undefined' ? this._generateDefaultValue() : options.default;
		this.minimum = typeof options.minimum === 'undefined' ? null : options.minimum;
		this.maximum = typeof options.maximum === 'undefined' ? null : options.maximum;
		this.inclusive = typeof options.inclusive === 'undefined' ? false : options.inclusive;
		this.configurable = typeof options.configurable === 'undefined' ? this.type !== 'any' : options.configurable;
		this.filter = typeof options.filter === 'undefined' ? null : options.filter;
		this.shouldResolve = typeof options.resolve === 'undefined' ? true : options.resolve;
	}

	/**
	 * Get the serializer that manages this instance.
	 */
	public get serializer(): Serializer | null {
		if (this.client === null) throw new Error('Cannot retrieve serializers from non-initialized SchemaEntry.');
		return this.client.serializers.get(this.type) || null;
	}

	/**
	 * Edits this SchemaEntry instance.
	 * @param options The options to edit
	 */
	public edit(options: SchemaEntryEditOptions = {}): this {
		if (typeof options.type === 'string') this.type = options.type.toLowerCase();
		if (typeof options.array !== 'undefined') this.array = options.array;
		if (typeof options.configurable !== 'undefined') this.configurable = options.configurable;
		if (typeof options.default !== 'undefined') this.default = options.default;
		if (typeof options.filter !== 'undefined') this.filter = options.filter;
		if (typeof options.inclusive !== 'undefined') this.inclusive = options.inclusive;
		if (typeof options.resolve !== 'undefined') this.shouldResolve = options.resolve;

		if (('minimum' in options) || ('maximum' in options)) {
			const { minimum = null, maximum = null } = options;
			this.minimum = minimum;
			this.maximum = maximum;
		}

		return this;
	}

	/**
	 * Overload to serialize this entry to JSON.
	 */
	public toJSON(): SchemaEntryJson {
		return {
			type: this.type,
			array: this.array,
			configurable: this.configurable,
			default: this.default,
			inclusive: this.inclusive,
			maximum: this.maximum,
			minimum: this.minimum,
			resolve: this.shouldResolve
		};
	}

	/**
	 * Performs the validity checks of this entry
	 * @internal
	 */
	public _check(): void {
		if (this.client === null) throw new Error('Cannot retrieve serializers from non-initialized SchemaEntry.');

		// Check type
		if (typeof this.type !== 'string') throw new TypeError(`[KEY] ${this.path} - Parameter 'type' must be a string.`);
		if (!this.client.serializers.has(this.type)) throw new TypeError(`[KEY] ${this.path} - '${this.type}' is not a valid type.`);

		// Check array
		if (typeof this.array !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter 'array' must be a boolean.`);

		// Check configurable
		if (typeof this.configurable !== 'boolean') throw new TypeError(`[KEY] ${this.path} - Parameter 'configurable' must be a boolean.`);

		// Check limits
		if (this.minimum !== null && !isNumber(this.minimum)) throw new TypeError(`[KEY] ${this.path} - Parameter 'minimum' must be a number or null.`);
		if (this.maximum !== null && !isNumber(this.maximum)) throw new TypeError(`[KEY] ${this.path} - Parameter 'maximum' must be a number or null.`);
		if (this.minimum !== null && this.maximum !== null && this.minimum > this.maximum) {
			throw new TypeError(`[KEY] ${this.path} - Parameter 'minimum' must contain a value lower than the parameter 'maximum'.`);
		}

		// Check filter
		if (this.filter !== null && !isFunction(this.filter)) throw new TypeError(`[KEY] ${this.path} - Parameter 'filter' must be a function`);

		// Check default
		if (this.array) {
			if (!Array.isArray(this.default)) throw new TypeError(`[DEFAULT] ${this.path} - Default key must be an array if the key stores an array.`);
		} else if (this.default !== null) {
			if (['boolean', 'string'].includes(this.type) && typeof this.default !== this.type) throw new TypeError(`[DEFAULT] ${this.path} - Default key must be a ${this.type}.`);
		}
	}

	/**
	 * The default value generator, called when type and array are given but not the default itself.
	 */
	private _generateDefaultValue(): unknown {
		if (this.array) return [];
		if (this.type === 'boolean') return false;
		return null;
	}

	/**
	 * Check whether or not the value is a SchemaEntry.
	 * @since 0.6.0
	 * @param value The value to check.
	 */
	public static is(value: Schema | SchemaEntry): value is SchemaEntry {
		return value.type !== 'Folder';
	}

}

export interface SchemaEntryOptions {
	array?: boolean;
	configurable?: boolean;
	default?: unknown;
	filter?: SchemaEntryFilterFunction | null;
	inclusive?: boolean;
	maximum?: number | null;
	minimum?: number | null;
	resolve?: boolean;
}

export interface SchemaEntryEditOptions extends SchemaEntryOptions {
	type?: string;
}

export type SchemaEntryJson = Required<Omit<SchemaEntryEditOptions, 'filter'>>;

export interface SchemaEntryFilterFunction {
	(client: Client, value: any, context: SerializerUpdateContext): void | boolean;
}
