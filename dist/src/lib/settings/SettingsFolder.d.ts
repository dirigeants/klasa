import { SchemaEntry } from './schema/SchemaEntry';
import type { Guild, Client } from '@klasa/core';
import type { Schema } from './schema/Schema';
import type { SchemaFolder } from './schema/SchemaFolder';
import type { SerializerUpdateContext } from '../structures/Serializer';
import type { Settings } from './Settings';
export declare class SettingsFolder extends Map<string, unknown> {
    /**
     * The reference to the base Settings instance.
     */
    base: Settings | null;
    /**
     * The schema that manages this folder's structure.
     */
    readonly schema: Schema;
    constructor(schema: Schema);
    /**
     * The client that manages this instance.
     */
    get client(): Client;
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
    get(path: string): unknown;
    /**
     * Plucks out one or more attributes from either an object or a sequence of objects
     * @param  paths The paths to take
     * @example
     * const [x, y] = message.guild.settings.pluck('x', 'y');
     * console.log(x, y);
     */
    pluck(...paths: readonly string[]): unknown[];
    /**
     * Resolves paths into their full objects or values depending on the current set value
     * @param paths The paths to resolve
     */
    resolve(...paths: readonly string[]): Promise<unknown[]>;
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
    reset(): Promise<SettingsUpdateResults>;
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
    reset(path: string, options?: Readonly<SettingsFolderResetOptions>): Promise<SettingsUpdateResults>;
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
    reset(paths: readonly string[], options?: Readonly<SettingsFolderResetOptions>): Promise<SettingsUpdateResults>;
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
    reset(object: ReadonlyKeyedObject, options?: Readonly<SettingsFolderResetOptions>): Promise<SettingsUpdateResults>;
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
    update(path: string, value: unknown, options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults>;
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
    update(entries: [string, unknown][], options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults>;
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
    update(entries: ReadonlyKeyedObject, options?: SettingsFolderUpdateOptions): Promise<SettingsUpdateResults>;
    /**
     * Overload to serialize this entry to JSON.
     */
    toJSON(): SettingsFolderJson;
    /**
     * Patch an object against this instance.
     * @param data The data to apply to this instance
     */
    protected _patch(data: unknown): void;
    /**
     * Initializes a SettingsFolder, preparing it for later usage.
     * @param folder The children folder of this instance
     * @param schema The schema that manages the folder
     */
    protected _init(folder: SettingsFolder, schema: Schema | SchemaFolder): void;
    protected _save(context: SettingsUpdateContext): Promise<void>;
    private _resolveFolder;
    private _resolveEntry;
    private _resetSettingsFolder;
    private _resetSettingsEntry;
    private _processUpdate;
    private _updateSettingsEntry;
    private _updateSettingsEntryNotIndexed;
    private _updateSettingsEntryAtIndex;
    private _resolveValues;
    private _resolveNextValue;
    private _updateSchemaEntryValue;
}
/**
 * The existence status of this settings entry. They're the possible values for {@link Settings#existenceStatus} and
 * represents its status in disk.
 * @memberof SettingsFolder
 */
export declare const enum SettingsExistenceStatus {
    /**
     * The settings has not been synchronized, in this status, any update operation will error. To prevent this, call
     * `settings.sync()` first.
     */
    Unsynchronized = 0,
    /**
     * The settings entry exists in disk, any disk operation will be done through an update.
     */
    Exists = 1,
    /**
     * The settings entry does not exist in disk, the first disk operation will be done through a create. Afterwards it
     * sets itself to Exists.
     */
    NotExists = 2
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
export declare type SettingsFolderUpdateOptions = SettingsFolderUpdateOptionsOverwrite | SettingsFolderUpdateOptionsNonOverwrite;
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
export declare type SettingsUpdateResults = readonly SettingsUpdateResult[];
/**
 * A plain object keyed by the schema's keys and containing serialized values. Nested folders will appear as an object
 * of this type.
 * @memberof SettingsFolder
 */
export declare type SettingsFolderJson = Record<string, unknown>;
/**
 * The actions to take on Settings#update calls.
 * @memberof SettingsFolder
 */
export declare const enum ArrayActions {
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
    Add = "add",
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
    Remove = "remove",
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
    Auto = "auto",
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
    Overwrite = "overwrite"
}
export declare type KeyedObject = Record<PropertyKey, unknown>;
export declare type ReadonlyKeyedObject = Readonly<Record<PropertyKey, Readonly<unknown>>>;
/**
 * The actions as a string, done for retrocompatibility.
 * @memberof SettingsFolder
 * @internal
 */
export declare type ArrayActionsString = 'add' | 'remove' | 'auto' | 'overwrite';
