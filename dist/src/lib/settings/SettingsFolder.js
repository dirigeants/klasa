"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsFolder = void 0;
const SchemaFolder_1 = require("./schema/SchemaFolder");
const SchemaEntry_1 = require("./schema/SchemaEntry");
const utils_1 = require("@klasa/utils");
/* eslint-disable no-dupe-class-members */
class SettingsFolder extends Map {
    constructor(schema) {
        super();
        this.base = null;
        this.schema = schema;
    }
    /**
     * The client that manages this instance.
     */
    get client() {
        if (this.base === null)
            throw new Error('Cannot retrieve gateway from a non-ready settings instance.');
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
    get(path) {
        try {
            return path.split('.').reduce((folder, key) => Map.prototype.get.call(folder, key), this);
        }
        catch {
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
    pluck(...paths) {
        return paths.map(path => {
            const value = this.get(path);
            return value instanceof SettingsFolder ? value.toJSON() : value;
        });
    }
    /**
     * Resolves paths into their full objects or values depending on the current set value
     * @param paths The paths to resolve
     */
    resolve(...paths) {
        var _a;
        if (this.base === null)
            return Promise.reject(new Error('Cannot retrieve guild from a non-ready settings instance.'));
        const guild = this.client.guilds.resolve(this.base.target);
        const language = (_a = guild === null || guild === void 0 ? void 0 : guild.language) !== null && _a !== void 0 ? _a : this.base.gateway.client.languages.default;
        return Promise.all(paths.map(path => {
            const entry = this.schema.get(path);
            if (typeof entry === 'undefined')
                return undefined;
            return SchemaFolder_1.SchemaFolder.is(entry) ?
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
    async reset(paths = [...this.keys()], options = {}) {
        var _a;
        if (this.base === null) {
            throw new Error('Cannot reset keys from a non-ready settings instance.');
        }
        if (this.base.existenceStatus === 0 /* Unsynchronized */) {
            throw new Error('Cannot reset keys from a pending to synchronize settings instance. Perhaps you want to call `sync()` first.');
        }
        if (this.base.existenceStatus === 2 /* NotExists */) {
            return [];
        }
        if (typeof paths === 'string')
            paths = [paths];
        else if (utils_1.isObject(paths))
            paths = utils_1.objectToTuples(paths).map(entries => entries[0]);
        const { client, schema } = this;
        const onlyConfigurable = typeof options.onlyConfigurable === 'undefined' ? false : options.onlyConfigurable;
        const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.base.target : options.guild);
        const language = (_a = guild === null || guild === void 0 ? void 0 : guild.language) !== null && _a !== void 0 ? _a : client.languages.default;
        const extra = options.extraContext;
        const changes = [];
        for (const path of paths) {
            const entry = schema.get(path);
            // If the key does not exist, throw
            if (typeof entry === 'undefined')
                throw language.get('SETTING_GATEWAY_KEY_NOEXT', path);
            if (SchemaFolder_1.SchemaFolder.is(entry))
                this._resetSettingsFolder(changes, entry, language, onlyConfigurable);
            else
                this._resetSettingsEntry(changes, entry, language, onlyConfigurable);
        }
        if (changes.length !== 0)
            await this._save({ changes, guild, language, extraContext: extra });
        return changes;
    }
    async update(pathOrEntries, valueOrOptions, options) {
        if (this.base === null) {
            throw new Error('Cannot update keys from a non-ready settings instance.');
        }
        if (this.base.existenceStatus === 0 /* Unsynchronized */) {
            throw new Error('Cannot update keys from a pending to synchronize settings instance. Perhaps you want to call `sync()` first.');
        }
        let entries;
        if (typeof pathOrEntries === 'string') {
            entries = [[pathOrEntries, valueOrOptions]];
            options = typeof options === 'undefined' ? {} : options;
        }
        else if (utils_1.isObject(pathOrEntries)) {
            entries = utils_1.objectToTuples(pathOrEntries);
            options = typeof valueOrOptions === 'undefined' ? {} : valueOrOptions;
        }
        else {
            entries = pathOrEntries;
            options = typeof valueOrOptions === 'undefined' ? {} : valueOrOptions;
        }
        return this._processUpdate(entries, options);
    }
    /**
     * Overload to serialize this entry to JSON.
     */
    toJSON() {
        return Object.fromEntries([...super.entries()].map(([key, value]) => [key, value instanceof SettingsFolder ? value.toJSON() : value]));
    }
    /**
     * Patch an object against this instance.
     * @param data The data to apply to this instance
     */
    _patch(data) {
        for (const [key, value] of Object.entries(data)) {
            // Retrieve the key and guard it, if it's undefined, it's not in the schema.
            const childValue = super.get(key);
            if (typeof childValue === 'undefined')
                continue;
            if (childValue instanceof SettingsFolder)
                childValue._patch(value);
            else
                super.set(key, value);
        }
    }
    /**
     * Initializes a SettingsFolder, preparing it for later usage.
     * @param folder The children folder of this instance
     * @param schema The schema that manages the folder
     */
    _init(folder, schema) {
        folder.base = this.base;
        for (const [key, value] of schema.entries()) {
            if (SchemaFolder_1.SchemaFolder.is(value)) {
                const settings = new SettingsFolder(value);
                folder.set(key, settings);
                this._init(settings, value);
            }
            else {
                folder.set(key, value.default);
            }
        }
    }
    async _save(context) {
        const updateObject = {};
        for (const change of context.changes) {
            utils_1.mergeObjects(updateObject, utils_1.makeObject(change.entry.path, change.next));
        }
        const base = this.base;
        const { gateway, id } = base;
        /* istanbul ignore if: Extremely hard to reproduce in coverage testing */
        if (gateway.provider === null)
            throw new Error('Cannot update due to the gateway missing a reference to the provider.');
        if (base.existenceStatus === 1 /* Exists */) {
            await gateway.provider.update(gateway.name, id, context.changes);
            this._patch(updateObject);
            gateway.client.emit('settingsUpdate', base, updateObject, context);
        }
        else {
            await gateway.provider.create(gateway.name, id, context.changes);
            base.existenceStatus = 1 /* Exists */;
            this._patch(updateObject);
            gateway.client.emit('settingsCreate', base, updateObject, context);
        }
    }
    async _resolveFolder(context) {
        const promises = [];
        for (const entry of context.folder.values()) {
            if (SchemaFolder_1.SchemaFolder.is(entry)) {
                promises.push(this._resolveFolder({
                    folder: entry,
                    language: context.language,
                    guild: context.guild,
                    extraContext: context.extraContext
                }).then(value => [entry.key, value]));
            }
            else {
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
    async _resolveEntry(context) {
        const values = this.get(context.entry.path);
        if (typeof values === 'undefined')
            return undefined;
        if (!context.entry.shouldResolve)
            return values;
        const { serializer } = context.entry;
        if (serializer === null)
            throw new Error('The serializer was not available during the resolve.');
        if (context.entry.array) {
            return (await Promise.all(values
                .map(value => serializer.resolve(value, context))))
                .filter(value => value !== null);
        }
        return serializer.resolve(values, context);
    }
    _resetSettingsFolder(changes, schemaFolder, language, onlyConfigurable) {
        let nonConfigurable = 0;
        let skipped = 0;
        let processed = 0;
        // Recurse to all sub-pieces
        for (const entry of schemaFolder.values(true)) {
            if (onlyConfigurable && !entry.configurable) {
                ++nonConfigurable;
                continue;
            }
            const previous = this.base.get(entry.path);
            const next = entry.default;
            const equals = entry.array ?
                utils_1.arrayStrictEquals(previous, next) :
                previous === entry.default;
            if (equals) {
                ++skipped;
            }
            else {
                ++processed;
                changes.push({
                    previous,
                    next,
                    entry
                });
            }
        }
        // If there are no changes, no skipped entries, and it only triggered non-configurable entries, throw.
        if (processed === 0 && skipped === 0 && nonConfigurable !== 0)
            throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
    }
    _resetSettingsEntry(changes, schemaEntry, language, onlyConfigurable) {
        if (onlyConfigurable && !schemaEntry.configurable) {
            throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_KEY', schemaEntry.key);
        }
        const previous = this.base.get(schemaEntry.path);
        const next = schemaEntry.default;
        const equals = schemaEntry.array ?
            utils_1.arrayStrictEquals(previous, next) :
            previous === next;
        if (!equals) {
            changes.push({
                previous,
                next,
                entry: schemaEntry
            });
        }
    }
    async _processUpdate(entries, options) {
        var _a;
        const { client, schema } = this;
        const onlyConfigurable = typeof options.onlyConfigurable === 'undefined' ? false : options.onlyConfigurable;
        const arrayAction = typeof options.arrayAction === 'undefined' ? "auto" /* Auto */ : options.arrayAction;
        const arrayIndex = typeof options.arrayIndex === 'undefined' ? null : options.arrayIndex;
        const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.base.target : options.guild);
        const language = (_a = guild === null || guild === void 0 ? void 0 : guild.language) !== null && _a !== void 0 ? _a : client.languages.default;
        const extra = options.extraContext;
        const internalOptions = { arrayAction, arrayIndex, onlyConfigurable };
        const promises = [];
        for (const [path, value] of entries) {
            const entry = schema.get(path);
            // If the key does not exist, throw
            if (typeof entry === 'undefined')
                throw language.get('SETTING_GATEWAY_KEY_NOEXT', path);
            if (SchemaFolder_1.SchemaFolder.is(entry)) {
                const keys = onlyConfigurable ?
                    [...entry.values()].filter(val => SchemaEntry_1.SchemaEntry.is(val) && val.configurable).map(val => val.key) :
                    [...entry.keys()];
                throw keys.length > 0 ?
                    language.get('SETTING_GATEWAY_CHOOSE_KEY', keys) :
                    language.get('SETTING_GATEWAY_UNCONFIGURABLE_FOLDER');
            }
            else if (!entry.configurable && onlyConfigurable) {
                throw language.get('SETTING_GATEWAY_UNCONFIGURABLE_KEY', path);
            }
            promises.push(this._updateSettingsEntry(path, value, { entry: entry, language, guild, extraContext: extra }, internalOptions));
        }
        const changes = await Promise.all(promises);
        if (changes.length !== 0)
            await this._save({ changes, guild, language, extraContext: extra });
        return changes;
    }
    async _updateSettingsEntry(key, rawValue, context, options) {
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
        if (options.arrayAction === "overwrite" /* Overwrite */) {
            return { previous, next: this._resolveNextValue(await this._resolveValues(rawValue, context, true), context), entry: context.entry };
        }
        // The next value depends on whether arrayIndex was set or not
        const next = options.arrayIndex === null ?
            this._updateSettingsEntryNotIndexed(previous, await this._resolveValues(rawValue, context, false), context, options) :
            this._updateSettingsEntryAtIndex(previous, await this._resolveValues(rawValue, context, options.arrayAction === "remove" /* Remove */), options.arrayIndex, options.arrayAction);
        return {
            previous,
            next,
            entry: context.entry
        };
    }
    _updateSettingsEntryNotIndexed(previous, values, context, options) {
        const clone = previous.slice(0);
        const serializer = context.entry.serializer;
        if (options.arrayAction === "auto" /* Auto */) {
            // Array action auto must add or remove values, depending on their existence
            for (const value of values) {
                const index = clone.indexOf(value);
                if (index === -1)
                    clone.push(value);
                else
                    clone.splice(index, 1);
            }
        }
        else if (options.arrayAction === "add" /* Add */) {
            // Array action add must add values, throw on existent
            for (const value of values) {
                if (clone.includes(value))
                    throw new Error(context.language.get('SETTING_GATEWAY_DUPLICATE_VALUE', context.entry, serializer.stringify(value, context.guild)));
                clone.push(value);
            }
        }
        else if (options.arrayAction === "remove" /* Remove */) {
            // Array action remove must add values, throw on non-existent
            for (const value of values) {
                const index = clone.indexOf(value);
                if (index === -1)
                    throw new Error(context.language.get('SETTING_GATEWAY_MISSING_VALUE', context.entry, serializer.stringify(value, context.guild)));
                clone.splice(index, 1);
            }
        }
        else {
            throw new TypeError(`The ${options.arrayAction} array action is not a valid array action.`);
        }
        return clone;
    }
    _updateSettingsEntryAtIndex(previous, values, arrayIndex, arrayAction) {
        if (arrayIndex < 0 || arrayIndex > previous.length) {
            throw new RangeError(`The index ${arrayIndex} is bigger than the current array. It must be a value in the range of 0..${previous.length}.`);
        }
        let clone = previous.slice();
        if (arrayAction === "add" /* Add */) {
            clone.splice(arrayIndex, 0, ...values);
        }
        else if (arrayAction === "remove" /* Remove */ || values.every(nv => nv === null)) {
            clone.splice(arrayIndex, values.length);
        }
        else {
            clone.splice(arrayIndex, values.length, ...values);
            clone = clone.filter(nv => nv !== null);
        }
        return clone;
    }
    async _resolveValues(value, context, acceptNull) {
        return Array.isArray(value) ?
            await Promise.all(value.map(val => this._updateSchemaEntryValue(val, context, acceptNull))) :
            [await this._updateSchemaEntryValue(value, context, acceptNull)];
    }
    _resolveNextValue(value, context) {
        if (Array.isArray(value)) {
            const filtered = value.filter(nv => nv !== null);
            return filtered.length === 0 ? context.entry.default : filtered;
        }
        return value === null ? context.entry.default : value;
    }
    async _updateSchemaEntryValue(value, context, acceptNull) {
        if (acceptNull && value === null)
            return null;
        const { serializer } = context.entry;
        /* istanbul ignore if: Extremely hard to reproduce in coverage testing */
        if (serializer === null)
            throw new TypeError('The serializer was not available during the update.');
        const parsed = await serializer.validate(value, context);
        if (context.entry.filter !== null && context.entry.filter(this.client, parsed, context))
            throw context.language.get('SETTING_GATEWAY_INVALID_FILTERED_VALUE', context.entry, value);
        return serializer.serialize(parsed);
    }
}
exports.SettingsFolder = SettingsFolder;
//# sourceMappingURL=SettingsFolder.js.map