import { isNumber, isFunction } from '@klasa/utils';

import type { Client } from '@klasa/core';
import type { Serializer, SerializerUpdateContext } from '../../structures/Serializer';
import type { Schema } from './Schema';

export class SchemaEntry {

	/**
	 * The KlasaClient for this SchemaEntry.
	 */
	public client: Client | null = null;

	/**
	 * The schema that manages this instance.
	 */
	public readonly parent: Schema;

	/**
	 * The key of this entry relative to its parent.
	 */
	public readonly key: string;

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
	 * The filter to use for this entry when resolving.
	 */
	public filter: SchemaEntryFilterFunction | null;

	/**
	 * Whether or not values managed by this entry should be resolved.
	 */
	public shouldResolve: boolean;

	public constructor(parent: Schema, key: string, type: string, options: SchemaEntryOptions = {}) {
		this.client = null;
		this.parent = parent;
		this.key = key;
		this.type = type.toLowerCase();
		this.array = typeof options.array === 'undefined' ? typeof options.default === 'undefined' ? false : Array.isArray(options.default) : options.array;
		this.default = typeof options.default === 'undefined' ? this._generateDefaultValue() : options.default;
		this.minimum = typeof options.minimum === 'undefined' ? null : options.minimum;
		this.maximum = typeof options.maximum === 'undefined' ? null : options.maximum;
		this.inclusive = typeof options.inclusive === 'undefined' ? false : options.inclusive;
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
		if (typeof this.type !== 'string') throw new TypeError(`[KEY] ${this.key} - Parameter 'type' must be a string.`);
		if (!this.client.serializers.has(this.type)) throw new TypeError(`[KEY] ${this.key} - '${this.type}' is not a valid type.`);

		// Check array
		if (typeof this.array !== 'boolean') throw new TypeError(`[KEY] ${this.key} - Parameter 'array' must be a boolean.`);

		// Check limits
		if (this.minimum !== null && !isNumber(this.minimum)) throw new TypeError(`[KEY] ${this.key} - Parameter 'minimum' must be a number or null.`);
		if (this.maximum !== null && !isNumber(this.maximum)) throw new TypeError(`[KEY] ${this.key} - Parameter 'maximum' must be a number or null.`);
		if (this.minimum !== null && this.maximum !== null && this.minimum > this.maximum) {
			throw new TypeError(`[KEY] ${this.key} - Parameter 'minimum' must contain a value lower than the parameter 'maximum'.`);
		}

		// Check filter
		if (this.filter !== null && !isFunction(this.filter)) throw new TypeError(`[KEY] ${this.key} - Parameter 'filter' must be a function`);

		// Check default
		if (this.array) {
			if (!Array.isArray(this.default)) throw new TypeError(`[DEFAULT] ${this.key} - Default key must be an array if the key stores an array.`);
		} else if (this.default !== null) {
			if (['boolean', 'string'].includes(this.type) && typeof this.default !== this.type) throw new TypeError(`[DEFAULT] ${this.key} - Default key must be a ${this.type}.`);
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

}

export interface SchemaEntryOptions {
	array?: boolean;
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
