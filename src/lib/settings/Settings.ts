import { Cache } from '@klasa/cache';
import { objectToTuples, arrayStrictEquals, isObject } from '@klasa/utils';

import type { Client, Guild } from '@klasa/core';
import type { SerializerUpdateContext, Serializer } from '../structures/Serializer';
import type { SchemaEntry } from './schema/SchemaEntry';
import type { Gateway } from './gateway/Gateway';

export class Settings extends Cache<string, unknown> {

	/**
	 * The ID of the database entry this instance manages.
	 */
	public readonly id: string;

	/**
	 * The gateway that manages this instance.
	 */
	public readonly gateway: Gateway;

	/**
	 * The holder of this instance.
	 */
	public readonly target: unknown;

	/**
	 * The existence status of this entry.
	 * @internal
	 */
	public existenceStatus: SettingsExistenceStatus;

	public constructor(gateway: Gateway, target: unknown, id: string) {
		super();
		this.id = id;
		this.gateway = gateway;
		this.target = target;
		this.existenceStatus = SettingsExistenceStatus.Unsynchronized;
		this._init();
	}

	/**
	 * Creates a clone of this instance.
	 */
	public clone(): Settings {
		const clone = new Settings(this.gateway, this.target, this.id);
		clone._patch(this.toJSON());
		return clone;
	}

	/**
	 * Sync the data from the database with the cache.
	 * @param force Whether or not this should force a database synchronization
	 */
	public async sync(force = this.existenceStatus === SettingsExistenceStatus.Unsynchronized): Promise<this> {
		// If not force and the instance has already been synchronized with the database, return this
		if (this.existenceStatus === SettingsExistenceStatus.Defaults || (!force && this.existenceStatus !== SettingsExistenceStatus.Unsynchronized)) return this;

		// Push a synchronization task to the request handler queue
		const data = await this.gateway.requestHandler.push(this.id);
		if (data) {
			this.existenceStatus = SettingsExistenceStatus.Exists;
			this._patch(data);
			this.gateway.client.emit('settingsSync', this);
		} else {
			this.existenceStatus = SettingsExistenceStatus.NotExists;
		}

		return this;
	}

	/**
	 * Delete this entry from the database and clean all the values to their defaults.
	 */
	public async destroy(): Promise<this> {
		if (this.existenceStatus === SettingsExistenceStatus.Defaults) return this;
		await this.sync();
		if (this.existenceStatus === SettingsExistenceStatus.Exists) {
			const { provider } = this.gateway;
			/* istanbul ignore if: Hard to coverage test the catch */
			if (provider === null) throw new Error('The provider was not available during the destroy operation.');
			await provider.delete(this.gateway.name, this.id);
			this.gateway.client.emit('settingsDelete', this);
			this._init();
			this.existenceStatus = SettingsExistenceStatus.NotExists;
		}

		return this;
	}

	/**
	 * The client that manages this instance.
	 */
	public get client(): Client {
		return this.gateway.client;
	}

	/**
	 * Plucks out one or more attributes from either an object or a sequence of objects
	 * @param  paths The paths to take
	 * @example
	 * const [x, y] = message.guild.settings.pluck('x', 'y');
	 * console.log(x, y);
	 */
	public pluck(...paths: readonly string[]): unknown[] {
		return paths.map(path => this.get(path));
	}

	/**
	 * Resolves paths into their full objects or values depending on the current set value
	 * @param paths The paths to resolve
	 */
	public resolve(...paths: readonly string[]): Promise<unknown[]> {
		const guild = this.client.guilds.resolve(this.target);
		const language = guild?.language ?? this.client.languages.default;
		return Promise.all(paths.map(path => {
			const entry = this.gateway.schema.get(path);
			if (typeof entry === 'undefined') return undefined;
			return this._resolveEntry({
				entry,
				language,
				guild,
				extraContext: null
			});
		}));
	}

	/**
	 * Resets all keys from the instance.
	 * @example
	 * // Resets all entries:
	 * await message.guild.settings.reset();
	 */
	public async reset(): Promise<SettingsUpdateResults>;
	/**
	 * Resets a key from the instance.
	 * @param path The path of the key to reset from the instance
	 * @param options The options for this action
	 * @example
	 * // Resets an entry:
	 * await message.guild.settings.reset('prefix');
	 */
	public async reset(path: string, options?: Readonly<SettingsResetOptions>): Promise<SettingsUpdateResults>;
	/**
	 * Resets multiple keys from the instance.
	 * @param paths The paths of the keys to reset from the instance
	 * @param options The options for this action
	 * @example
	 * // Resets an entry:
	 * await message.guild.settings.reset(['prefix']);
	 *
	 * @example
	 * // Resets multiple entries:
	 * await message.guild.settings.reset(['prefix', 'administrator']);
	 */
	public async reset(paths: readonly string[], options?: Readonly<SettingsResetOptions>): Promise<SettingsUpdateResults>;
	/**
	 * Resets multiple keys from the instance.
	 * @param object The object to retrieve the paths of the keys to reset from the instance
	 * @param options The options for this action
	 * @example
	 * // Resets an entry:
	 * await message.guild.settings.reset({ prefix: null });
	 *
	 * @example
	 * // Resets multiple entries with a regular object:
	 * await message.guild.settings.reset({ prefix: null, administrator: null });
	 */
	public async reset(object: ReadonlyKeyedObject, options?: Readonly<SettingsResetOptions>): Promise<SettingsUpdateResults>;
	public async reset(paths: string | ReadonlyKeyedObject | readonly string[] = [...this.keys()], options: Readonly<SettingsResetOptions> = {}): Promise<SettingsUpdateResults> {
		if (this.existenceStatus === SettingsExistenceStatus.Defaults) {
			throw new Error('Cannot reset keys from an default settings instance.');
		}
		if (this.existenceStatus === SettingsExistenceStatus.Unsynchronized) {
			throw new Error('Cannot reset keys from an unsynchronized settings instance. Perhaps you want to call `sync()` first.');
		}

		if (this.existenceStatus === SettingsExistenceStatus.NotExists) {
			return [];
		}

		if (typeof paths === 'string') paths = [paths];
		else if (isObject(paths)) paths = objectToTuples(paths as Record<string, unknown>).map(entries => entries[0]);

		const { client, gateway } = this;
		const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.target : options.guild);
		const language = guild?.language ?? client.languages.default;
		const extra = options.extraContext;

		const changes: SettingsUpdateResult[] = [];
		for (const path of paths as readonly string[]) {
			const entry = gateway.schema.get(path);

			// If the key does not exist, throw
			if (typeof entry === 'undefined') throw new Error(language.get('SETTING_GATEWAY_KEY_NOEXT', path));
			this._resetSettingsEntry(changes, entry);
		}

		if (changes.length !== 0) await this._save({ changes, guild, language, extraContext: extra });
		return changes;
	}

	/**
	 * Update a key from the instance.
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
	public update(path: string, value: unknown, options?: SettingsUpdateOptions): Promise<SettingsUpdateResults>;
	/**
	 * Update one or more keys from the instance.
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
	public update(entries: [string, unknown][], options?: SettingsUpdateOptions): Promise<SettingsUpdateResults>;
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
	public update(entries: ReadonlyKeyedObject, options?: SettingsUpdateOptions): Promise<SettingsUpdateResults>;
	public async update(pathOrEntries: PathOrEntries, valueOrOptions?: ValueOrOptions, options?: SettingsUpdateOptions): Promise<SettingsUpdateResults> {
		if (this.existenceStatus === SettingsExistenceStatus.Defaults) {
			throw new Error('Cannot update values from an default settings instance.');
		}
		if (this.existenceStatus === SettingsExistenceStatus.Unsynchronized) {
			throw new Error('Cannot update values from an unsynchronized settings instance. Perhaps you want to call `sync()` first.');
		}

		let entries: [string, unknown][];
		if (typeof pathOrEntries === 'string') {
			entries = [[pathOrEntries, valueOrOptions as unknown]];
			options = typeof options === 'undefined' ? {} : options;
		} else if (isObject(pathOrEntries)) {
			entries = Object.entries(pathOrEntries as ReadonlyKeyedObject) as [string, unknown][];
			options = typeof valueOrOptions === 'undefined' ? {} : valueOrOptions as SettingsUpdateOptions;
		} else {
			entries = pathOrEntries as [string, unknown][];
			options = typeof valueOrOptions === 'undefined' ? {} : valueOrOptions as SettingsUpdateOptions;
		}

		return this._processUpdate(entries, options as InternalRawUpdateOptions);
	}

	/**
	 * Overload to serialize this entry to JSON.
	 */
	public toJSON(): SettingsJson {
		return Object.fromEntries(this.map((value, key) => [key, value]));
	}

	/**
	 * Patch an object against this instance.
	 * @param data The data to apply to this instance
	 */
	protected _patch(data: unknown): void {
		for (const [key, value] of Object.entries(data as Record<PropertyKey, unknown>)) {
			// Retrieve the key and guard it, if it's undefined, it's not in the schema.
			const childValue = this.get(key);
			if (typeof childValue !== 'undefined') this.set(key, value);
		}
	}

	/**
	 * Initializes the instance, preparing it for later usage.
	 */
	protected _init(): void {
		for (const [key, value] of this.gateway.schema.entries()) {
			this.set(key, value.default);
		}
	}

	protected async _save(context: SettingsUpdateContext): Promise<void> {
		const updateObject: KeyedObject = Object.fromEntries(context.changes.map(change => [change.entry.key, change.next]));
		const { gateway, id } = this;

		/* istanbul ignore if: Extremely hard to reproduce in coverage testing */
		if (gateway.provider === null) throw new Error('Cannot update due to the gateway missing a reference to the provider.');
		if (this.existenceStatus === SettingsExistenceStatus.Exists) {
			await gateway.provider.update(gateway.name, id, context.changes);
			this._patch(updateObject);
			gateway.client.emit('settingsUpdate', this, updateObject, context);
		} else {
			await gateway.provider.create(gateway.name, id, context.changes);
			this.existenceStatus = SettingsExistenceStatus.Exists;
			this._patch(updateObject);
			gateway.client.emit('settingsCreate', this, updateObject, context);
		}
	}

	private async _resolveEntry(context: SerializerUpdateContext): Promise<unknown> {
		const values = this.get(context.entry.key);
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

	private _resetSettingsEntry(changes: SettingsUpdateResult[], schemaEntry: SchemaEntry): void {
		const previous = this.get(schemaEntry.key);
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

	private async _processUpdate(entries: [string, unknown][], options: InternalRawUpdateOptions): Promise<SettingsUpdateResults> {
		const { client, gateway } = this;
		const arrayAction = typeof options.arrayAction === 'undefined' ? ArrayActions.Auto : options.arrayAction as ArrayActions;
		const arrayIndex = typeof options.arrayIndex === 'undefined' ? null : options.arrayIndex;
		const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.target : options.guild);
		const language = guild?.language ?? client.languages.default;
		const extra = options.extraContext;
		const internalOptions: InternalSettingsUpdateOptions = { arrayAction, arrayIndex };

		const promises: Promise<SettingsUpdateResult>[] = [];
		for (const [path, value] of entries) {
			const entry = gateway.schema.get(path);

			// If the key does not exist, throw
			if (typeof entry === 'undefined') throw new Error(language.get('SETTING_GATEWAY_KEY_NOEXT', path));
			promises.push(this._updateSettingsEntry(path, value, { entry: entry as SchemaEntry, language, guild, extraContext: extra }, internalOptions));
		}

		const changes = await Promise.all(promises);
		if (changes.length !== 0) await this._save({ changes, guild, language, extraContext: extra });
		return changes;
	}

	private async _updateSettingsEntry(key: string, rawValue: unknown, context: SerializerUpdateContext, options: InternalSettingsUpdateOptions): Promise<SettingsUpdateResult> {
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

	private _updateSettingsEntryNotIndexed(previous: readonly unknown[], values: readonly unknown[], context: SerializerUpdateContext, options: InternalSettingsUpdateOptions): unknown[] {
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

		if (context.entry.filter !== null && context.entry.filter(this.client, parsed, context)) throw new Error(context.language.get('SETTING_GATEWAY_INVALID_FILTERED_VALUE', context.entry, value));
		return serializer.serialize(parsed);
	}

}

/**
 * The existence status of this settings entry. They're the possible values for {@link Settings#existenceStatus} and
 * represents its status in disk.
 * @memberof Settings
 */
export const enum SettingsExistenceStatus {
	/**
	 * The settings exists only as a source of defaults and should not sync or other forms of updating.
	 */
	Defaults,
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
 * The options for {@link Settings#reset}.
 * @memberof Settings
 */
export interface SettingsResetOptions {
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
 * The options for {@link Settings#update} when specifying `arrayAction` as overwrite.
 * @memberof Settings
 */
export interface SettingsUpdateOptionsOverwrite extends SettingsResetOptions {
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
 * The options for {@link Settings#update} when not specifying `arrayAction` as overwrite or leaving it default.
 * @memberof Settings
 */
export interface SettingsUpdateOptionsNonOverwrite extends SettingsResetOptions {
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
 * The options for {@link Settings#update}.
 * @memberof Settings
 */
export type SettingsUpdateOptions = SettingsUpdateOptionsOverwrite | SettingsUpdateOptionsNonOverwrite;

/**
 * The update context that is passed to the {@link Client#settingsUpdate} and {@link Client#settingsCreate} events.
 * @memberof Settings
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
 * @memberof Settings
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
 * @memberof Settings
 */
export type SettingsUpdateResults = readonly SettingsUpdateResult[];

/**
 * A plain object keyed by the schema's keys and containing serialized values.
 * @memberof Settings
 */
export type SettingsJson = Record<string, unknown>;

/**
 * The actions to take on Settings#update calls.
 * @memberof Settings
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
 * @memberof Settings
 * @internal
 */
export type ArrayActionsString = 'add' | 'remove' | 'auto' | 'overwrite';

/**
 * The internal sanitized options created by {@link Settings#update} to avoid mutation of the original options.
 * @memberof Settings
 * @internal
 */
interface InternalSettingsUpdateOptions {
	readonly arrayAction: ArrayActions;
	readonly arrayIndex: number | null;
}

/**
 * The values {@link Settings#reset} and {@link Settings#update} accept.
 * @memberof Settings
 */
type PathOrEntries = string | [string, unknown][] | ReadonlyKeyedObject;

/**
 * The possible values or the options passed.
 */
type ValueOrOptions = unknown | SettingsUpdateOptions;

/**
 * @memberof Settings
 * @internal
 */
type InternalRawUpdateOptions = SettingsUpdateOptions & SettingsUpdateOptionsNonOverwrite;
