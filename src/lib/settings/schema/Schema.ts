import { Cache } from '@klasa/cache';
import { SchemaEntry, SchemaEntryOptions, SchemaEntryJson } from './SchemaEntry';
import { Settings, SettingsExistenceStatus } from '../Settings';

/* eslint-disable no-dupe-class-members */

export class Schema extends Cache<string, SchemaEntry> {

	/**
	 * The defaults for this schema.
	 */
	public readonly defaults: Settings;

	/**
	 * Whether or not this instance is ready.
	 */
	public ready: boolean;

	/**
	 * Constructs the schema
	 */
	public constructor() {
		super();

		this.ready = false;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		this.defaults = new Settings({ schema: this }, null, '');
		this.defaults.existenceStatus = SettingsExistenceStatus.Defaults;
	}

	/**
	 * Adds or replaces an entry to this instance.
	 * @param key The key of the entry to add
	 * @param value The entry to add
	 */
	public set(key: string, value: SchemaEntry): this {
		if (this.ready) throw new Error('Cannot modify the schema after being initialized.');
		this.defaults.set(key, value.default);
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
	public add(key: string, type: string, options?: SchemaEntryOptions): this {
		const previous = super.get(key);
		if (typeof previous !== 'undefined') {
			// Edit the previous key
			const schemaEntry = previous;
			schemaEntry.edit({ type, ...options });
			this.defaults.set(key, schemaEntry.default);
			return this;
		}

		this.set(key, new SchemaEntry(this, key, type, options));
		return this;
	}

	/**
	 * Returns an object literal composed of all children serialized recursively.
	 */
	public toJSON(): Record<string, SchemaEntryJson> {
		return Object.fromEntries(this.map((value, key) => [key, value.toJSON()]));
	}

}
