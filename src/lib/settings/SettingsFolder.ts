import { Schema } from './schema/Schema';
import { Settings } from './Settings';
import { SchemaFolder } from './schema/SchemaFolder';
import { SchemaEntry } from './schema/SchemaEntry';
import { isObject, objectToTuples, mergeObjects, makeObject, arrayStrictEquals } from '@klasa/utils';
import { SerializerUpdateContext, Serializer } from '../structures/Serializer';
import { KlasaClient } from '../Client';
import { Language } from '../structures/Language';
import { Guild } from '@klasa/core';

/* eslint-disable no-dupe-class-members */

export class SettingsFolder extends Map<string, unknown> {

	/**
	 * The reference to the base Settings instance.
	 */
	public base: Settings | null;

	/**
	 * The schema that manages this folder's structure.
	 */
	public readonly schema: Schema;

	public constructor(schema: Schema) {
		super();
		this.base = null;
		this.schema = schema;
	}

	/**
	 * The client that manages this instance.
	 */
	public get client(): KlasaClient {
		if (this.base === null) throw new Error('Cannot retrieve gateway from a non-ready settings instance.');
		return this.base.gateway.client;
	}

	/**
	 * Get a value from the configuration. Accepts nested objects separating by dot
	 * @param path The path of the key's value to get from this instance
	 * @example
	 * // Simple get
	 * const prefix = message.guild.settings.get('prefix');
	 *
	 * // Nested entry
	 * const channel = message.guild.settings.get('channels.moderation-logs');
	 */
	public get(path: string): unknown {
		try {
			return path.split('.').reduce((folder, key) => Map.prototype.get.call(folder, key), this);
		} catch {
			return undefined;
		}
	}

	/**
	 * Plucks out one or more attributes from either an object or a sequence of objects
	 * @param  paths The paths to take
	 * @example
	 * const [x, y] = message.guild.settings.pluck('x', 'y');
	 * console.log(x, y);
	 */
	public pluck(...paths: readonly string[]): unknown[] {
		return paths.map(path => {
			const value = this.get(path);
			return value instanceof SettingsFolder ? value.toJSON() : value;
		});
	}

	/**
	 * Resolves paths into their full objects or values depending on the current set value
	 * @param paths The paths to resolve
	 */
	public resolve(...paths: readonly string[]): Promise<unknown[]> {
		if (this.base === null) return Promise.reject(new Error('Cannot retrieve guild from a non-ready settings instance.'));

		const guild = this.client.guilds.resolve(this.base.target);
		const language = guild?.language ?? this.base.gateway.client.languages.default;
		return Promise.all(paths.map(path => {
			const entry = this.schema.get(path);
			if (typeof entry === 'undefined') return undefined;
			return SchemaFolder.is(entry) ?
				this._resolveFolder({
					folder: entry,
					language,
					guild,
					extraContext: null
				}) :
				this._resolveEntry({
					entry,
					language,
					guild,
					extraContext: null
				});
		}));
	}

	/**
	 * Resets all keys from this settings folder.
	 * @example
	 * // Resets all entries:
	 * await message.guild.settings.reset();
	 *
	 * @example
	 * // Resets all entries from a folder:
	 * await message.guild.settings.get('roles').reset();
	 */
	public async reset(): Promise<SettingsUpdateResults>;
	/**
	 * Resets a key from this settings folder.
	 * @param path The path of the key to reset from this settings folder
	 * @param options The options for this action
	 * @example
	 * // Resets an entry:
	 * await message.guild.settings.reset('prefix');
	 *
	 * @example
	 * // Resets an entry contained by a folder:
	 * await message.guild.settings.reset('roles.administrator');
	 *
	 * @example
	 * // Resets an entry from a folder:
	 * await message.guild.settings.get('roles').reset('administrator');
	 */
	public async reset(path: string, options?: Readonly<SettingsFolderResetOptions>): Promise<SettingsUpdateResults>;
	/**
	 * Resets multiple keys from this settings folder.
	 * @param paths The paths of the keys to reset from this settings folder
	 * @param options The options for this action
	 * @example
	 * // Resets an entry:
	 * await message.guild.settings.reset(['prefix']);
	 *
	 * @example
	 * // Resets multiple entries:
	 * await message.guild.settings.reset(['prefix', 'roles.administrator']);
	 *
	 * @example
	 * // Resets a key and an entire folder:
	 * await message.guild.settings.reset(['prefix', 'roles']);
	 */
	public async reset(paths: readonly string[], options?: Readonly<SettingsFolderResetOptions>): Promise<SettingsUpdateResults>;
	/**
	 * Resets multiple keys from this settings folder.
	 * @param object The object to retrieve the paths of the keys to reset from this settings folder
	 * @param options The options for this action
	 * @example
	 * // Resets an entry:
	 * await message.guild.settings.reset({ prefix: null });
	 *
	 * @example
	 * // Resets multiple entries with a regular object:
	 * await message.guild.settings.reset({ prefix: null, roles: { administrator: null } });
	 *
	 * @example
	 * // Resets multiple entries with a dotted object:
	 * await message.guild.settings.reset({ prefix: null, 'roles.administrator': null });
	 *
	 * @example
	 * // Resets a key and an entire folder:
	 * await message.guild.settings.reset({ prefix: null, roles: null });
	 */
	public async reset(object: ReadonlyKeyedObject, options?: Readonly<SettingsFolderResetOptions>): Promise<SettingsUpdateResults>;
	public async reset(paths: string | ReadonlyKeyedObject | readonly string[] = [...this.keys()], options: Readonly<SettingsFolderResetOptions> = {}): Promise<SettingsUpdateResults> {
		if (this.base === null) {
			throw new Error('Cannot reset keys from a non-ready settings instance.');
		}

		if (this.base.existenceStatus === SettingsExistenceStatus.Unsynchronized) {
			throw new Error('Cannot reset keys from a pending to synchronize settings instance. Perhaps you want to call `sync()` first.');
		}

		if (this.base.existenceStatus === SettingsExistenceStatus.NotExists) {
			return [];
		}

		if (typeof paths === 'string') paths = [paths];
		else if (isObject(paths)) paths = objectToTuples(paths as Record<string, unknown>).map(entries => entries[0]);

		const { client, schema } = this;
		const onlyConfigurable = typeof options.onlyConfigurable === 'undefined' ? false : options.onlyConfigurable;
		const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.base.target : options.guild);
		const language = guild?.language ?? client.languages.default;
		const extra = options.extraContext;

		const changes: SettingsUpdateResult[] = [];
		for (const path of paths as readonly string[]) {
			const entry = schema.get(path);

			// If the key does not exist, throw
			if (typeof entry === 'undefined') throw language.get('SETTING_GATEWAY_KEY_NOEXT', path);
			if (SchemaFolder.is(entry)) this._resetSettingsFolder(changes, entry as SchemaFolder, language, onlyConfigurable);
			else this._resetSettingsEntry(changes, entry as SchemaEntry, language, onlyConfigurable);
		}

		if (changes.length !== 0) await this._save({ changes, guild, language, extraContext: extra });
		return changes;
	}

	/**
	 * Update a key from this settings folder.
	 * @param path The path of the key to update
	 * @param value The new value to validate and set
	 * @param options The options for this update
	 * @example
	 * // Change the prefix to '$':
	 * await message.guild.settings.update('prefix', '$');
	 *
	 * @example
	 * // Add a new value to an array
	 * await message.guild.settings.update('disabledCommands', 'ping', { arrayAction: 'add' });
	 *
	 * @example
	 * // Remove a value from an array
	 * await message.guild.settings.update('disabledCommands', 'ping', { arrayAction: 'remove' });
	 *
	 * @example
	 * // Remove a value from an array of tuples ([[k1, v1], [k2, v2], ...])
	 * const tags = message.guild.settings.get('tags');
	 * const index = tags.findIndex(([tag]) => tag === 'foo');
	 * await message.guild.settings.update('tags', null, { arrayIndex: index });
	 */
	public update(path: string, value: unknown, options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults>;
	/**
	 * Update one or more keys from this settings folder.
	 * @param entries The key and value pairs to update
	 * @param options The options for this update
	 * @example
	 * // Change the prefix to '$' and update disabledCommands adding/removing 'ping':
	 * await message.guild.settings.update([['prefix', '$'], ['disabledCommands', 'ping']]);
	 *
	 * @example
	 * // Add a new value to an array
	 * await message.guild.settings.update([['disabledCommands', 'ping']], { arrayAction: 'add' });
	 *
	 * @example
	 * // Remove a value from an array
	 * await message.guild.settings.update([['disabledCommands', 'ping']], { arrayAction: 'remove' });
	 *
	 * @example
	 * // Remove a value from an array of tuples ([[k1, v1], [k2, v2], ...])
	 * const tags = message.guild.settings.get('tags');
	 * const index = tags.findIndex(([tag]) => tag === 'foo');
	 * await message.guild.settings.update([['tags', null]], { arrayIndex: index });
	 */
	public update(entries: [string, unknown][], options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults>;
	/**
	 * Update one or more keys using an object approach.
	 * @param entries An object to flatten and update
	 * @param options The options for this update
	 * @example
	 * // Change the prefix to '$' and update disabledCommands adding/removing 'ping':
	 * await message.guild.settings.update({ prefix: '$', disabledCommands: 'ping' });
	 *
	 * @example
	 * // Add a new value to an array
	 * await message.guild.settings.update({ disabledCommands: ['ping'] }, { arrayAction: 'add' });
	 *
	 * @example
	 * // Remove a value from an array
	 * await message.guild.settings.update({ disabledCommands: ['ping'] }, { arrayAction: 'remove' });
	 *
	 * @example
	 * // Remove a value from an array of tuples ([[k1, v1], [k2, v2], ...])
	 * const tags = message.guild.settings.get('tags');
	 * const index = tags.findIndex(([tag]) => tag === 'foo');
	 * await message.guild.settings.update({ tags: null }, { arrayIndex: index });
	 */
	public update(entries: ReadonlyKeyedObject, options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults>;
	public async update(pathOrEntries: PathOrEntries, valueOrOptions?: ValueOrOptions, options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults> {
		if (this.base === null) {
			throw new Error('Cannot update keys from a non-ready settings instance.');
		}

		if (this.base.existenceStatus === SettingsExistenceStatus.Unsynchronized) {
			throw new Error('Cannot update keys from a pending to synchronize settings instance. Perhaps you want to call `sync()` first.');
		}

		let entries: [string, unknown][];
		if (typeof pathOrEntries === 'string') {
			entries = [[pathOrEntries, valueOrOptions as unknown]];
			options = typeof options === 'undefined' ? {} : options;
		} else if (isObject(pathOrEntries)) {
			entries = objectToTuples(pathOrEntries as ReadonlyKeyedObject) as [string, unknown][];
			options = typeof valueOrOptions === 'undefined' ? {} : valueOrOptions as SettingsFolderUpdateOptions;
		} else {
			entries = pathOrEntries as [string, unknown][];
			options = typeof valueOrOptions === 'undefined' ? {} : valueOrOptions as SettingsFolderUpdateOptions;
		}

		return this._processUpdate(entries, options as InternalRawFolderUpdateOptions);
	}

	/**
	 * Overload to serialize this entry to JSON.
	 */
	public toJSON(): SettingsFolderJson {
		return Object.fromEntries([...super.entries()].map(([key, value]) => [key, value instanceof SettingsFolder ? value.toJSON() : value]));
	}

	/**
	 * Patch an object against this instance.
	 * @param data The data to apply to this instance
	 */
	protected _patch(data: object): void {
		for (const [key, value] of Object.entries(data)) {
			// Retrieve the key and guard it, if it's undefined, it's not in the schema.
			const childValue = super.get(key);
			if (typeof childValue === 'undefined') continue;

			if (childValue instanceof SettingsFolder) childValue._patch(value);
			else super.set(key, value);
		}
	}

	/**
	 * Initializes a SettingsFolder, preparing it for later usage.
	 * @param folder The children folder of this instance
	 * @param schema The schema that manages the folder
	 */
	protected _init(folder: SettingsFolder, schema: Schema | SchemaFolder): void {
		folder.base = this.base;

		for (const [key, value] of schema.entries()) {
			if (SchemaFolder.is(value)) {
				const settings = new SettingsFolder(value);
				folder.set(key, settings);
				this._init(settings, value as SchemaFolder);
			} else {
				folder.set(key, (value as SchemaEntry).default);
			}
		}
	}

	protected async _save(context: SettingsUpdateContext): Promise<void> {
		const updateObject: KeyedObject = {};
		for (const change of context.changes) {
			mergeObjects(updateObject, makeObject(change.entry.path, change.next));
		}

		const base = this.base as Settings;
		const { gateway, id } = base;

		/* istanbul ignore if: Extremely hard to reproduce in coverage testing */
		if (gateway.provider === null) throw new Error('Cannot update due to the gateway missing a reference to the provider.');
		if (base.existenceStatus === SettingsExistenceStatus.Exists) {
			await gateway.provider.update(gateway.name, id, context.changes);
			this._patch(updateObject);
			gateway.client.emit('settingsUpdate', base, updateObject, context);
		} else {
			await gateway.provider.create(gateway.name, id, context.changes);
			base.existenceStatus = SettingsExistenceStatus.Exists;
			this._patch(updateObject);
			gateway.client.emit('settingsCreate', base, updateObject, context);
		}
	}

	private async _resolveFolder(context: InternalFolderUpdateContext): Promise<object> {
		const promises: Promise<[string, unknown]>[] = [];
		for (const entry of context.folder.values()) {
			if (SchemaFolder.is(entry)) {
				promises.push(this._resolveFolder({
					folder: entry,
					language: context.language,
					guild: context.guild,
					extraContext: context.extraContext
				}).then(value => [entry.key, value]));
			} else {
				promises.push(this._resolveEntry({
					entry,
					language: context.language,
					guild: context.guild,
					extraContext: context.extraContext
				}).then(value => [entry.key, value]));
			}
		}

		return Object.fromEntries(await Promise.all(promises));
	}

	private async _resolveEntry(context: SerializerUpdateContext): Promise<unknown> {
		const values = this.get(context.entry.path);
		if (typeof values === 'undefined') return undefined;

		if (!context.entry.shouldResolve) return values;

		const { serializer } = context.entry;
		if (serializer === null) throw new Error('The serializer was not available during the resolve.');
		if (context.entry.array) {
			return (await Promise.all((values as readonly unknown[])
				.map(value => serializer.resolve(value, context))))
				.filter(value => value !== null);
		}

		return serializer.resolve(values, context);
	}

	private _resetSettingsFolder(changes: SettingsUpdateResult[], schemaFolder: SchemaFolder, language: Language, onlyConfigurable: boolean): void {
		let nonConfigurable = 0;
		let skipped = 0;
		let processed = 0;

		// Recurse to all sub-pieces
		for (const entry of schemaFolder.values(true)) {
			if (onlyConfigurable && !entry.configurable) {
				++nonConfigurable;
				continue;
			}

			const previous = (this.base as Settings).get(entry.path);
			const next = entry.default;
			const equals = entry.array ?
				arrayStrictEquals(previous as unknown as readonly unknown[], next as readonly unknown[]) :
				previous === entry.default;

			if (equals) {
				++skipped;
			} else {
				++processed;
				changes.push({
					previous,
					next,
					entry
				});
			}
		}

		// If there are no changes, no skipped entries, and it only triggered non-configurable entries, throw.
		if (processed === 0 && skipped === 0 && nonConfigurable !== 0) throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
	}

	private _resetSettingsEntry(changes: SettingsUpdateResult[], schemaEntry: SchemaEntry, language: Language, onlyConfigurable: boolean): void {
		if (onlyConfigurable && !schemaEntry.configurable) {
			throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_KEY', schemaEntry.key);
		}

		const previous = (this.base as Settings).get(schemaEntry.path);
		const next = schemaEntry.default;

		const equals = schemaEntry.array ?
			arrayStrictEquals(previous as unknown as readonly unknown[], next as readonly unknown[]) :
			previous === next;

		if (!equals) {
			changes.push({
				previous,
				next,
				entry: schemaEntry
			});
		}
	}

	private async _processUpdate(entries: [string, unknown][], options: InternalRawFolderUpdateOptions): Promise<SettingsUpdateResults> {
		const { client, schema } = this;
		const onlyConfigurable = typeof options.onlyConfigurable === 'undefined' ? false : options.onlyConfigurable;
		const arrayAction = typeof options.arrayAction === 'undefined' ? ArrayActions.Auto : options.arrayAction as ArrayActions;
		const arrayIndex = typeof options.arrayIndex === 'undefined' ? null : options.arrayIndex;
		const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? (this.base as Settings).target : options.guild);
		const language = guild?.language ?? client.languages.default;
		const extra = options.extraContext;
		const internalOptions: InternalSettingsFolderUpdateOptions = { arrayAction, arrayIndex, onlyConfigurable };

		const promises: Promise<SettingsUpdateResult>[] = [];
		for (const [path, value] of entries) {
			const entry = schema.get(path);

			// If the key does not exist, throw
			if (typeof entry === 'undefined') throw language.get('SETTING_GATEWAY_KEY_NOEXT', path);
			if (SchemaFolder.is(entry)) {
				const keys = onlyConfigurable ?
					[...entry.values()].filter(val => SchemaEntry.is(val) && val.configurable).map(val => val.key) :
					[...entry.keys()];
				throw keys.length > 0 ?
					language.get('SETTING_GATEWAY_CHOOSE_KEY', keys) :
					language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
			} else if (!(entry as SchemaEntry).configurable && onlyConfigurable) {
				throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_KEY', path);
			}

			promises.push(this._updateSettingsEntry(path, value, { entry: entry as SchemaEntry, language, guild, extraContext: extra }, internalOptions));
		}

		const changes = await Promise.all(promises);
		if (changes.length !== 0) await this._save({ changes, guild, language, extraContext: extra });
		return changes;
	}

	private async _updateSettingsEntry(key: string, rawValue: unknown, context: SerializerUpdateContext, options: InternalSettingsFolderUpdateOptions): Promise<SettingsUpdateResult> {
		const previous = this.get(key);

		// If null or undefined, return the default value instead
		if (rawValue === null || typeof rawValue === 'undefined') {
			return { previous, next: context.entry.default, entry: context.entry };
		}

		// If the entry doesn't take an array, all the extra steps should be skipped
		if (!context.entry.array) {
			const values = await this._updateSchemaEntryValue(rawValue, context, true);
			return { previous, next: this._resolveNextValue(values, context), entry: context.entry };
		}

		// If the action is overwrite, resolve values accepting null, afterwards filter them out
		if (options.arrayAction === ArrayActions.Overwrite) {
			return { previous, next: this._resolveNextValue(await this._resolveValues(rawValue, context, true), context), entry: context.entry };
		}

		// The next value depends on whether arrayIndex was set or not
		const next = options.arrayIndex === null ?
			this._updateSettingsEntryNotIndexed(previous as unknown[], await this._resolveValues(rawValue, context, false), context, options) :
			this._updateSettingsEntryAtIndex(previous as unknown[], await this._resolveValues(rawValue, context, options.arrayAction === ArrayActions.Remove), options.arrayIndex, options.arrayAction);

		return {
			previous,
			next,
			entry: context.entry
		};
	}

	private _updateSettingsEntryNotIndexed(previous: readonly unknown[], values: readonly unknown[], context: SerializerUpdateContext, options: InternalSettingsFolderUpdateOptions): unknown[] {
		const clone = previous.slice(0);
		const serializer = context.entry.serializer as Serializer;
		if (options.arrayAction === ArrayActions.Auto) {
			// Array action auto must add or remove values, depending on their existence
			for (const value of values) {
				const index = clone.indexOf(value);
				if (index === -1) clone.push(value);
				else clone.splice(index, 1);
			}
		} else if (options.arrayAction === ArrayActions.Add) {
			// Array action add must add values, throw on existent
			for (const value of values) {
				if (clone.includes(value)) throw new Error(context.language.get('SETTING_GATEWAY_DUPLICATE_VALUE', context.entry, serializer.stringify(value, context.guild)));
				clone.push(value);
			}
		} else if (options.arrayAction === ArrayActions.Remove) {
			// Array action remove must add values, throw on non-existent
			for (const value of values) {
				const index = clone.indexOf(value);
				if (index === -1) throw new Error(context.language.get('SETTING_GATEWAY_MISSING_VALUE', context.entry, serializer.stringify(value, context.guild)));
				clone.splice(index, 1);
			}
		} else {
			throw new TypeError(`The ${options.arrayAction} array action is not a valid array action.`);
		}

		return clone;
	}

	private _updateSettingsEntryAtIndex(previous: readonly unknown[], values: readonly unknown[], arrayIndex: number, arrayAction: ArrayActions | null): unknown[] {
		if (arrayIndex < 0 || arrayIndex > previous.length) {
			throw new RangeError(`The index ${arrayIndex} is bigger than the current array. It must be a value in the range of 0..${previous.length}.`);
		}

		let clone = previous.slice();
		if (arrayAction === ArrayActions.Add) {
			clone.splice(arrayIndex, 0, ...values);
		} else if (arrayAction === ArrayActions.Remove || values.every(nv => nv === null)) {
			clone.splice(arrayIndex, values.length);
		} else {
			clone.splice(arrayIndex, values.length, ...values);
			clone = clone.filter(nv => nv !== null);
		}

		return clone;
	}

	private async _resolveValues(value: unknown, context: SerializerUpdateContext, acceptNull: boolean): Promise<unknown[]> {
		return Array.isArray(value) ?
			await Promise.all(value.map(val => this._updateSchemaEntryValue(val, context, acceptNull))) :
			[await this._updateSchemaEntryValue(value, context, acceptNull)];
	}

	private _resolveNextValue(value: unknown, context: SerializerUpdateContext): unknown {
		if (Array.isArray(value)) {
			const filtered = value.filter(nv => nv !== null);
			return filtered.length === 0 ? context.entry.default : filtered;
		}

		return value === null ? context.entry.default : value;
	}

	private async _updateSchemaEntryValue(value: unknown, context: SerializerUpdateContext, acceptNull: boolean): Promise<unknown> {
		if (acceptNull && value === null) return null;

		const { serializer } = context.entry;

		/* istanbul ignore if: Extremely hard to reproduce in coverage testing */
		if (serializer === null) throw new TypeError('The serializer was not available during the update.');
		const parsed = await serializer.validate(value, context);

		if (context.entry.filter !== null && context.entry.filter(this.client, parsed, context)) throw context.language.get('SETTING_GATEWAY_INVALID_FILTERED_VALUE', context.entry, value);
		return serializer.serialize(parsed);
	}

}

/**
 * The existence status of this settings entry. They're the possible values for {@link Settings#existenceStatus} and
 * represents its status in disk.
 * @memberof SettingsFolder
 */
export const enum SettingsExistenceStatus {
	/**
	 * The settings has not been synchronized, in this status, any update operation will error. To prevent this, call
	 * `settings.sync()` first.
	 */
	Unsynchronized,
	/**
	 * The settings entry exists in disk, any disk operation will be done through an update.
	 */
	Exists,
	/**
	 * The settings entry does not exist in disk, the first disk operation will be done through a create. Afterwards it
	 * sets itself to Exists.
	 */
	NotExists
}

/**
 * The options for {@link SettingsFolder#reset}.
 * @memberof SettingsFolder
 */
export interface SettingsFolderResetOptions {
	/**
	 * Whether or not the update should only update those configured with `configurable` set as `true` in the schema.
	 */
	onlyConfigurable?: boolean;
	/**
	 * The guild to use as the context. It's not required when the settings' target can be resolved into a Guild, e.g.
	 * a TextChannel, a Role, a GuildMember, or a Guild instance.
	 */
	guild?: Guild;
	/**
	 * The extra context to be passed through resolvers and events.
	 */
	extraContext?: unknown;
}

/**
 * The options for {@link SettingsFolder#update} when specifying `arrayAction` as overwrite.
 * @memberof SettingsFolder
 */
export interface SettingsFolderUpdateOptionsOverwrite extends SettingsFolderResetOptions {
	/**
	 * The array action, in this case overwrite and not supporting `arrayIndex`.
	 * @example
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 *
	 * await settings.update('words', ['hello', 'world'], { arrayAction: 'overwrite' });
	 * settings.get('words');
	 * // -> ['hello', 'world']
	 */
	arrayAction: ArrayActions.Overwrite | 'overwrite';
}

/**
 * The options for {@link SettingsFolder#update} when not specifying `arrayAction` as overwrite or leaving it default.
 * @memberof SettingsFolder
 */
export interface SettingsFolderUpdateOptionsNonOverwrite extends SettingsFolderResetOptions {
	/**
	 * The array action to take, check {@link ArrayActions} for the available actions.
	 */
	arrayAction?: Exclude<ArrayActions, ArrayActions.Overwrite> | Exclude<ArrayActionsString, 'overwrite'>;
	/**
	 * The index to do the array updates at. This is option is ignored when `arrayAction` is set to overwrite.
	 */
	arrayIndex?: number | null;
}

/**
 * The options for {@link SettingsFolder#update}.
 * @memberof SettingsFolder
 */
export type SettingsFolderUpdateOptions = SettingsFolderUpdateOptionsOverwrite | SettingsFolderUpdateOptionsNonOverwrite;

/**
 * The update context that is passed to the {@link Client#settingsUpdate} and {@link Client#settingsCreate} events.
 * @memberof SettingsFolder
 */
export interface SettingsUpdateContext extends Omit<SerializerUpdateContext, 'entry'> {
	/**
	 * The changes done.
	 */
	readonly changes: SettingsUpdateResults;
}

/**
 * One of the update results from {@link Settings#update}, containing the previous and next values, and the
 * {@link SchemaEntry} instance that controlled the value.
 * @memberof SettingsFolder
 */
export interface SettingsUpdateResult {
	/**
	 * The value prior to the update.
	 */
	readonly previous: unknown;
	/**
	 * The serialized value that has been set.
	 */
	readonly next: unknown;
	/**
	 * The SchemaEntry instance that contains the metadata for this update result.
	 */
	readonly entry: SchemaEntry;
}

/**
 * The update results from {@link Settings#update}, it contains an array of {@link SettingsUpdateResults results}.
 * @memberof SettingsFolder
 */
export type SettingsUpdateResults = readonly SettingsUpdateResult[];

/**
 * A plain object keyed by the schema's keys and containing serialized values. Nested folders will appear as an object
 * of this type.
 * @memberof SettingsFolder
 */
export type SettingsFolderJson = Record<string, unknown>;

/**
 * The actions to take on Settings#update calls.
 * @memberof SettingsFolder
 */
export const enum ArrayActions {
	/**
	 * Override the insert/remove behaviour by pushing new keys to the array to the end or to the specified position.
	 * @example
	 * // Push to the end:
	 *
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 *
	 * await settings.update('words', ['hello', 'world'], { arrayAction: 'add' });
	 * settings.get('words');
	 * // -> ['foo', 'bar', 'hello', 'world']
	 *
	 * @example
	 * // Push to a position:
	 *
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 *
	 * await settings.update('words', ['hello', 'world'], { arrayAction: 'add', arrayPosition: 1 });
	 * settings.get('words');
	 * // -> ['foo', 'hello', 'world', 'bar']
	 */
	Add = 'add',
	/**
	 * Override the insert/remove behaviour by removing keys to the array to the end or to the specified position.
	 * @throws Throws an error when a value does not exist.
	 * @example
	 * // Remove:
	 *
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 *
	 * await settings.update('words', ['foo'], { arrayAction: 'remove' });
	 * settings.get('words');
	 * // -> ['bar']
	 *
	 * @example
	 * // Remove from position:
	 *
	 * settings.get('words');
	 * // -> ['foo', 'hello', 'world', 'bar']
	 *
	 * await settings.update('words', [null, null], { arrayAction: 'remove', arrayPosition: 1 });
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 */
	Remove = 'remove',
	/**
	 * Set insert/remove behaviour, this is the value set by default.
	 * @example
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 *
	 * await settings.update('words', ['foo', 'hello']);
	 * settings.get('words');
	 * // -> ['bar', 'hello']
	 */
	Auto = 'auto',
	/**
	 * Overwrite the array with newly set values. The `arrayIndex` option is ignored when specifying overwrite.
	 * @example
	 * settings.get('words');
	 * // -> ['foo', 'bar']
	 *
	 * await settings.update('words', ['hello', 'world'], { arrayAction: 'overwrite' });
	 * settings.get('words');
	 * // -> ['hello', 'world']
	 */
	Overwrite = 'overwrite'
}

export type KeyedObject = Record<PropertyKey, unknown>;
export type ReadonlyKeyedObject = Readonly<Record<PropertyKey, Readonly<unknown>>>;

/**
 * The actions as a string, done for retrocompatibility.
 * @memberof SettingsFolder
 * @internal
 */
export type ArrayActionsString = 'add' | 'remove' | 'auto' | 'overwrite';

/**
 * The update context for resolving the entry, it is used to retrieve the entry setting.
 * @memberof SettingsFolder
 * @internal
 */
interface InternalFolderUpdateContext extends Omit<SerializerUpdateContext, 'entry'> {
	readonly folder: SchemaFolder;
}

/**
 * The internal sanitized options created by {@link SettingsFolder#update} to avoid mutation of the original options.
 * @memberof SettingsFolder
 * @internal
 */
interface InternalSettingsFolderUpdateOptions {
	readonly onlyConfigurable: boolean;
	readonly arrayAction: ArrayActions;
	readonly arrayIndex: number | null;
}

/**
 * The values {@link SettingsFolder#reset} and {@link SettingsFolder#update} accept.
 * @memberof SettingsFolder
 */
type PathOrEntries = string | [string, unknown][] | ReadonlyKeyedObject;

/**
 * The possible values or the options passed.
 */
type ValueOrOptions = unknown | SettingsFolderUpdateOptions;

/**
 * @memberof SettingsFolder
 * @internal
 */
type InternalRawFolderUpdateOptions = SettingsFolderUpdateOptions & SettingsFolderUpdateOptionsNonOverwrite;
