import { SettingsFolder } from '../SettingsFolder';
export declare class Schema extends Map<string, SchemaFolder | SchemaEntry> {
    /**
     * The base path for this schema.
     */
    readonly path: string;
    /**
     * The type of this schema.
     */
    readonly type: 'Folder';
    /**
     * The defaults for this schema.
     */
    readonly defaults: SettingsFolder;
    /**
     * Whether or not this instance is ready.
     */
    ready: boolean;
    /**
     * Constructs the schema
     */
    constructor(basePath?: string);
    /**
     * Adds or replaces an entry to this instance.
     * @param key The key of the entry to add
     * @param value The entry to add
     */
    set(key: string, value: SchemaFolder | SchemaEntry): this;
    /**
     * Removes an entry from this instance.
     * @param key The key of the element to remove
     */
    delete(key: string): boolean;
    /**
     * Add a new entry to this folder.
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
     * Add a nested folder to this one.
     * @param key The name for the folder to add
     * @param callback The callback receiving a SchemaFolder instance as a parameter
     * @example
     * // Create a schema with a key of experience contained in a folder named social:
     * // Later access with `schema.get('social.experience');`.
     * new Schema()
     *     .add('social', social => social
     *         .add('experience', 'integer', { minimum: 0 }));
     */
    add(key: string, callback: SchemaAddCallback): this;
    /**
     * Get a children entry from this schema.
     * @param path The key or path to get from this schema
     * @example
     * // Retrieve a key named experience that exists in this folder:
     * schema.get('experience');
     *
     * @example
     * // Retrieve a key named experience contained in a folder named social:
     * schema.get('social.experience');
     */
    get(path: string): SchemaFolder | SchemaEntry | undefined;
    /**
     * Returns a new Iterator object that contains the keys for each element contained in this folder.
     * Identical to [Map.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
     * @param recursive Whether the iteration should be recursive
     */
    keys(recursive?: boolean): IterableIterator<string>;
    /**
     * Returns a new Iterator object that contains the values for each element contained in this folder and children folders.
     * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
     * @param recursive Whether the iteration should be recursive
     */
    values(recursive: true): IterableIterator<SchemaEntry>;
    /**
     * Returns a new Iterator object that contains the values for each element contained in this folder.
     * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
     * @param recursive Whether the iteration should be recursive
     */
    values(recursive?: false): IterableIterator<SchemaFolder | SchemaEntry>;
    /**
     * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder and children folders.
     * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
     * @param recursive Whether the iteration should be recursive
     */
    entries(recursive: true): IterableIterator<[string, SchemaEntry]>;
    /**
     * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder.
     * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
     * @param recursive Whether the iteration should be recursive
     */
    entries(recursive?: false): IterableIterator<[string, SchemaFolder | SchemaEntry]>;
    /**
     * Returns an object literal composed of all children serialized recursively.
     */
    toJSON(): SchemaJson;
    /**
     * Check whether or not the value is a SchemaFolder.
     * @since 0.6.0
     * @param value The value to check.
     */
    static is(value: Schema | SchemaEntry): value is SchemaFolder;
}
export interface SchemaAddCallback {
    (folder: SchemaFolder): unknown;
}
export interface SchemaFolderJson extends Record<string, SchemaFolderJson | SchemaEntryJson> {
}
export interface SchemaJson extends Record<string, SchemaFolderJson | SchemaEntryJson> {
}
import { SchemaFolder } from './SchemaFolder';
import { SchemaEntry, SchemaEntryOptions, SchemaEntryJson } from './SchemaEntry';
