import { isFunction } from '@klasa/utils';
import { SettingsFolder } from '../SettingsFolder';

/* eslint-disable no-dupe-class-members */

export class Schema extends Map<string, SchemaFolder | SchemaEntry> {

	/**
	 * The base path for this schema.
	 */
	public readonly path: string;

	/**
	 * The type of this schema.
	 */
	public readonly type: 'Folder';

	/**
	 * The defaults for this schema.
	 */
	public readonly defaults: SettingsFolder;

	/**
	 * Whether or not this instance is ready.
	 */
	public ready: boolean;

	/**
	 * Constructs the schema
	 */
	public constructor(basePath = '') {
		super();

		this.ready = false;
		this.path = basePath;
		this.type = 'Folder';
		this.defaults = new SettingsFolder(this);
	}

	/**
	 * Adds or replaces an entry to this instance.
	 * @param key The key of the entry to add
	 * @param value The entry to add
	 */
	public set(key: string, value: SchemaFolder | SchemaEntry): this {
		if (this.ready) throw new Error('Cannot modify the schema after being initialized.');
		this.defaults.set(key, value instanceof Schema ? value.defaults : value.default);
		return super.set(key, value);
	}

	/**
	 * Removes an entry from this instance.
	 * @param key The key of the element to remove
	 */
	public delete(key: string): boolean {
		if (this.ready) throw new Error('Cannot modify the schema after being initialized.');
		this.defaults.delete(key);
		return super.delete(key);
	}

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
	public add(key: string, type: string, options?: SchemaEntryOptions): this;
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
	public add(key: string, callback: SchemaAddCallback): this;
	public add(key: string, typeOrCallback: string | SchemaAddCallback, options?: SchemaEntryOptions): this {
		let SchemaCtor: typeof SchemaEntry | typeof SchemaFolder;
		let type: string;
		let callback: SchemaAddCallback | null = null;
		if (isFunction(typeOrCallback)) {
			type = 'Folder';
			SchemaCtor = SchemaFolder;
			callback = typeOrCallback;
		} else {
			type = typeOrCallback;
			SchemaCtor = SchemaEntry;
			callback = null;
		}

		const previous = super.get(key);
		if (typeof previous !== 'undefined') {
			if (type === 'Folder') {
				if (SchemaFolder.is(previous)) {
					// Call the callback with the pre-existent Folder
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					callback!(previous);
					return this;
				}

				// If the type of the new entry is a Folder, the previous must also be a Folder.
				throw new Error(`The type for "${key}" conflicts with the previous value, expected type "Folder", got "${previous.type}".`);
			}

			// If the type of the new entry is not a Folder, the previous must also not be a Folder.
			if (SchemaFolder.is(previous)) {
				throw new Error(`The type for "${key}" conflicts with the previous value, expected a non-Folder, got "${previous.type}".`);
			}

			// Edit the previous key
			const schemaEntry = previous as SchemaEntry;
			schemaEntry.edit({ type, ...options });
			this.defaults.set(key, schemaEntry.default);
			return this;
		}

		const entry = new SchemaCtor(this, key, type, options);

		// eslint-disable-next-line callback-return
		if (callback !== null) callback(entry as SchemaFolder);
		this.set(key, entry);
		return this;
	}

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
	public get(path: string): SchemaFolder | SchemaEntry | undefined {
		const index = path.indexOf('.');
		if (index === -1) return super.get(path);

		const key = path.substring(0, index);
		const value = super.get(key);

		// If the returned value was undefined, return undefined
		if (typeof value === 'undefined') return undefined;

		// If the returned value is a SchemaFolder, return its result from SchemaFolder#get using remaining string
		if (SchemaFolder.is(value)) return value.get(path.substring(index + 1));

		// Trying to access to a subkey of an entry, return undefined
		return undefined;
	}

	/**
	 * Returns a new Iterator object that contains the keys for each element contained in this folder.
	 * Identical to [Map.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
	 * @param recursive Whether the iteration should be recursive
	 */
	public *keys(recursive = false): IterableIterator<string> {
		if (recursive) {
			for (const [key, value] of super.entries()) {
				if (SchemaFolder.is(value)) yield* value.keys(true);
				else yield key;
			}
		} else {
			yield* super.keys();
		}
	}

	/**
	 * Returns a new Iterator object that contains the values for each element contained in this folder and children folders.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @param recursive Whether the iteration should be recursive
	 */
	public values(recursive: true): IterableIterator<SchemaEntry>;
	/**
	 * Returns a new Iterator object that contains the values for each element contained in this folder.
	 * Identical to [Map.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values)
	 * @param recursive Whether the iteration should be recursive
	 */
	public values(recursive?: false): IterableIterator<SchemaFolder | SchemaEntry>;
	public *values(recursive = false): IterableIterator<SchemaFolder | SchemaEntry> {
		if (recursive) {
			for (const value of super.values()) {
				if (SchemaFolder.is(value)) yield* value.values(true);
				else yield value;
			}
		} else {
			yield* super.values();
		}
	}

	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder and children folders.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @param recursive Whether the iteration should be recursive
	 */
	public entries(recursive: true): IterableIterator<[string, SchemaEntry]>;
	/**
	 * Returns a new Iterator object that contains the `[key, value]` pairs for each element contained in this folder.
	 * Identical to [Map.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries)
	 * @param recursive Whether the iteration should be recursive
	 */
	public entries(recursive?: false): IterableIterator<[string, SchemaFolder | SchemaEntry]>;
	public *entries(recursive = false): IterableIterator<[string, SchemaFolder | SchemaEntry]> {
		if (recursive) {
			for (const [key, value] of super.entries()) {
				if (SchemaFolder.is(value)) yield* value.entries(true);
				else yield [key, value];
			}
		} else {
			yield* super.entries();
		}
	}

	/**
	 * Returns an object literal composed of all children serialized recursively.
	 */
	public toJSON(): SchemaJson {
		return Object.fromEntries([...this.entries()].map(([key, value]) => [key, value.toJSON()]));
	}

	/**
	 * Check whether or not the value is a SchemaFolder.
	 * @since 0.6.0
	 * @param value The value to check.
	 */
	public static is(value: Schema | SchemaEntry): value is SchemaFolder {
		return value.type === 'Folder';
	}

}

export interface SchemaAddCallback {
	(folder: SchemaFolder): unknown;
}

// Those are interfaces because they reference themselves, resulting on a compiler error. The other is for consistency.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SchemaFolderJson extends Record<string, SchemaFolderJson | SchemaEntryJson> { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SchemaJson extends Record<string, SchemaFolderJson | SchemaEntryJson> { }

import { SchemaFolder } from './SchemaFolder';
import { SchemaEntry, SchemaEntryOptions, SchemaEntryJson } from './SchemaEntry';
