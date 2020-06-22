import { Cache } from '@klasa/cache';
import { SchemaEntry, SchemaEntryOptions, SchemaEntryJson } from './SchemaEntry';
import { Settings } from '../Settings';
export declare class Schema extends Cache<string, SchemaEntry> {
    /**
     * The defaults for this schema.
     */
    readonly defaults: Settings;
    /**
     * Whether or not this instance is ready.
     */
    ready: boolean;
    /**
     * Constructs the schema
     */
    constructor();
    /**
     * Adds or replaces an entry to this instance.
     * @param key The key of the entry to add
     * @param value The entry to add
     */
    set(key: string, value: SchemaEntry): this;
    /**
     * Removes an entry from this instance.
     * @param key The key of the element to remove
     */
    delete(key: string): boolean;
    /**
     * Add a new entry to the schema.
     * @param key The name for the key to add
     * @param type The datatype, will be lowercased in the instance
     * @param options The options for the entry
     * @example
     * // Create a schema with a key of experience:
     * new Schema()
     *     .add('experience', 'integer', { minimum: 0 });
     *
     * @example
     * // Modify the built-in user schema to add experience and level:
     * KlasaClient.defaultUserSchema
     *     .add('experience', 'integer', { minimum: 0 })
     *     .add('level', 'integer', { minimum: 0 });
     */
    add(key: string, type: string, options?: SchemaEntryOptions): this;
    /**
     * Returns an object literal composed of all children serialized recursively.
     */
    toJSON(): Record<string, SchemaEntryJson>;
}
