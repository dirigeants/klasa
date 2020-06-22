"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const cache_1 = require("@klasa/cache");
const utils_1 = require("@klasa/utils");
class Settings extends cache_1.Cache {
    constructor(gateway, target, id) {
        super();
        this.id = id;
        this.gateway = gateway;
        this.target = target;
        this.existenceStatus = 0 /* Unsynchronized */;
        this._init();
    }
    /**
     * Creates a clone of this instance.
     */
    clone() {
        const clone = new Settings(this.gateway, this.target, this.id);
        clone._patch(this.toJSON());
        return clone;
    }
    /**
     * Sync the data from the database with the cache.
     * @param force Whether or not this should force a database synchronization
     */
    async sync(force = this.existenceStatus === 0 /* Unsynchronized */) {
        // If not force and the instance has already been synchronized with the database, return this
        if (!force && this.existenceStatus !== 0 /* Unsynchronized */)
            return this;
        // Push a synchronization task to the request handler queue
        const data = await this.gateway.requestHandler.push(this.id);
        if (data) {
            this.existenceStatus = 1 /* Exists */;
            this._patch(data);
            this.gateway.client.emit('settingsSync', this);
        }
        else {
            this.existenceStatus = 2 /* NotExists */;
        }
        return this;
    }
    /**
     * Delete this entry from the database and clean all the values to their defaults.
     */
    async destroy() {
        await this.sync();
        if (this.existenceStatus === 1 /* Exists */) {
            const { provider } = this.gateway;
            /* istanbul ignore if: Hard to coverage test the catch */
            if (provider === null)
                throw new Error('The provider was not available during the destroy operation.');
            await provider.delete(this.gateway.name, this.id);
            this.gateway.client.emit('settingsDelete', this);
            this._init();
            this.existenceStatus = 2 /* NotExists */;
        }
        return this;
    }
    /**
     * The client that manages this instance.
     */
    get client() {
        return this.gateway.client;
    }
    /**
     * Plucks out one or more attributes from either an object or a sequence of objects
     * @param  paths The paths to take
     * @example
     * const [x, y] = message.guild.settings.pluck('x', 'y');
     * console.log(x, y);
     */
    pluck(...paths) {
        return paths.map(path => this.get(path));
    }
    /**
     * Resolves paths into their full objects or values depending on the current set value
     * @param paths The paths to resolve
     */
    resolve(...paths) {
        var _a;
        const guild = this.client.guilds.resolve(this.target);
        const language = (_a = guild === null || guild === void 0 ? void 0 : guild.language) !== null && _a !== void 0 ? _a : this.client.languages.default;
        return Promise.all(paths.map(path => {
            const entry = this.gateway.schema.get(path);
            if (typeof entry === 'undefined')
                return undefined;
            return this._resolveEntry({
                entry,
                language,
                guild,
                extraContext: null
            });
        }));
    }
    async reset(paths = [...this.keys()], options = {}) {
        var _a;
        if (this.existenceStatus === 0 /* Unsynchronized */) {
            throw new Error('Cannot reset keys from an unsynchronized settings instance. Perhaps you want to call `sync()` first.');
        }
        if (this.existenceStatus === 2 /* NotExists */) {
            return [];
        }
        if (typeof paths === 'string')
            paths = [paths];
        else if (utils_1.isObject(paths))
            paths = utils_1.objectToTuples(paths).map(entries => entries[0]);
        const { client, gateway } = this;
        const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.target : options.guild);
        const language = (_a = guild === null || guild === void 0 ? void 0 : guild.language) !== null && _a !== void 0 ? _a : client.languages.default;
        const extra = options.extraContext;
        const changes = [];
        for (const path of paths) {
            const entry = gateway.schema.get(path);
            // If the key does not exist, throw
            if (typeof entry === 'undefined')
                throw new Error(language.get('SETTING_GATEWAY_KEY_NOEXT', path));
            this._resetSettingsEntry(changes, entry);
        }
        if (changes.length !== 0)
            await this._save({ changes, guild, language, extraContext: extra });
        return changes;
    }
    async update(pathOrEntries, valueOrOptions, options) {
        if (this.existenceStatus === 0 /* Unsynchronized */) {
            throw new Error('Cannot reset keys from an unsynchronized settings instance. Perhaps you want to call `sync()` first.');
        }
        let entries;
        if (typeof pathOrEntries === 'string') {
            entries = [[pathOrEntries, valueOrOptions]];
            options = typeof options === 'undefined' ? {} : options;
        }
        else if (utils_1.isObject(pathOrEntries)) {
            entries = Object.entries(pathOrEntries);
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
        return Object.fromEntries(this.map((value, key) => [key, value]));
    }
    /**
     * Patch an object against this instance.
     * @param data The data to apply to this instance
     */
    _patch(data) {
        for (const [key, value] of Object.entries(data)) {
            // Retrieve the key and guard it, if it's undefined, it's not in the schema.
            const childValue = this.get(key);
            if (typeof childValue !== 'undefined')
                this.set(key, value);
        }
    }
    /**
     * Initializes the instance, preparing it for later usage.
     */
    _init() {
        for (const [key, value] of this.gateway.schema.entries()) {
            this.set(key, value.default);
        }
    }
    async _save(context) {
        const updateObject = Object.fromEntries(context.changes.map(change => [change.entry.key, change.next]));
        const { gateway, id } = this;
        /* istanbul ignore if: Extremely hard to reproduce in coverage testing */
        if (gateway.provider === null)
            throw new Error('Cannot update due to the gateway missing a reference to the provider.');
        if (this.existenceStatus === 1 /* Exists */) {
            await gateway.provider.update(gateway.name, id, context.changes);
            this._patch(updateObject);
            gateway.client.emit('settingsUpdate', this, updateObject, context);
        }
        else {
            await gateway.provider.create(gateway.name, id, context.changes);
            this.existenceStatus = 1 /* Exists */;
            this._patch(updateObject);
            gateway.client.emit('settingsCreate', this, updateObject, context);
        }
    }
    async _resolveEntry(context) {
        const values = this.get(context.entry.key);
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
    _resetSettingsEntry(changes, schemaEntry) {
        const previous = this.get(schemaEntry.key);
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
        const { client, gateway } = this;
        const arrayAction = typeof options.arrayAction === 'undefined' ? "auto" /* Auto */ : options.arrayAction;
        const arrayIndex = typeof options.arrayIndex === 'undefined' ? null : options.arrayIndex;
        const guild = client.guilds.resolve(typeof options.guild === 'undefined' ? this.target : options.guild);
        const language = (_a = guild === null || guild === void 0 ? void 0 : guild.language) !== null && _a !== void 0 ? _a : client.languages.default;
        const extra = options.extraContext;
        const internalOptions = { arrayAction, arrayIndex };
        const promises = [];
        for (const [path, value] of entries) {
            const entry = gateway.schema.get(path);
            // If the key does not exist, throw
            if (typeof entry === 'undefined')
                throw new Error(language.get('SETTING_GATEWAY_KEY_NOEXT', path));
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
            throw new Error(context.language.get('SETTING_GATEWAY_INVALID_FILTERED_VALUE', context.entry, value));
        return serializer.serialize(parsed);
    }
}
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map