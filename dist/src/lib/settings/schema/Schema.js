"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const utils_1 = require("@klasa/utils");
const SettingsFolder_1 = require("../SettingsFolder");
/* eslint-disable no-dupe-class-members */
class Schema extends Map {
    /**
     * Constructs the schema
     */
    constructor(basePath = '') {
        super();
        this.ready = false;
        this.path = basePath;
        this.type = 'Folder';
        this.defaults = new SettingsFolder_1.SettingsFolder(this);
    }
    /**
     * Adds or replaces an entry to this instance.
     * @param key The key of the entry to add
     * @param value The entry to add
     */
    set(key, value) {
        if (this.ready)
            throw new Error('Cannot modify the schema after being initialized.');
        this.defaults.set(key, value instanceof Schema ? value.defaults : value.default);
        return super.set(key, value);
    }
    /**
     * Removes an entry from this instance.
     * @param key The key of the element to remove
     */
    delete(key) {
        if (this.ready)
            throw new Error('Cannot modify the schema after being initialized.');
        this.defaults.delete(key);
        return super.delete(key);
    }
    add(key, typeOrCallback, options) {
        let SchemaCtor;
        let type;
        let callback = null;
        if (utils_1.isFunction(typeOrCallback)) {
            type = 'Folder';
            SchemaCtor = SchemaFolder_1.SchemaFolder;
            callback = typeOrCallback;
        }
        else {
            type = typeOrCallback;
            SchemaCtor = SchemaEntry_1.SchemaEntry;
            callback = null;
        }
        const previous = super.get(key);
        if (typeof previous !== 'undefined') {
            if (type === 'Folder') {
                if (SchemaFolder_1.SchemaFolder.is(previous)) {
                    // Call the callback with the pre-existent Folder
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    callback(previous);
                    return this;
                }
                // If the type of the new entry is a Folder, the previous must also be a Folder.
                throw new Error(`The type for "${key}" conflicts with the previous value, expected type "Folder", got "${previous.type}".`);
            }
            // If the type of the new entry is not a Folder, the previous must also not be a Folder.
            if (SchemaFolder_1.SchemaFolder.is(previous)) {
                throw new Error(`The type for "${key}" conflicts with the previous value, expected a non-Folder, got "${previous.type}".`);
            }
            // Edit the previous key
            const schemaEntry = previous;
            schemaEntry.edit({ type, ...options });
            this.defaults.set(key, schemaEntry.default);
            return this;
        }
        const entry = new SchemaCtor(this, key, type, options);
        // eslint-disable-next-line callback-return
        if (callback !== null)
            callback(entry);
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
    get(path) {
        const index = path.indexOf('.');
        if (index === -1)
            return super.get(path);
        const key = path.substring(0, index);
        const value = super.get(key);
        // If the returned value was undefined, return undefined
        if (typeof value === 'undefined')
            return undefined;
        // If the returned value is a SchemaFolder, return its result from SchemaFolder#get using remaining string
        if (SchemaFolder_1.SchemaFolder.is(value))
            return value.get(path.substring(index + 1));
        // Trying to access to a subkey of an entry, return undefined
        return undefined;
    }
    /**
     * Returns a new Iterator object that contains the keys for each element contained in this folder.
     * Identical to [Map.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys)
     * @param recursive Whether the iteration should be recursive
     */
    *keys(recursive = false) {
        if (recursive) {
            for (const [key, value] of super.entries()) {
                if (SchemaFolder_1.SchemaFolder.is(value))
                    yield* value.keys(true);
                else
                    yield key;
            }
        }
        else {
            yield* super.keys();
        }
    }
    *values(recursive = false) {
        if (recursive) {
            for (const value of super.values()) {
                if (SchemaFolder_1.SchemaFolder.is(value))
                    yield* value.values(true);
                else
                    yield value;
            }
        }
        else {
            yield* super.values();
        }
    }
    *entries(recursive = false) {
        if (recursive) {
            for (const [key, value] of super.entries()) {
                if (SchemaFolder_1.SchemaFolder.is(value))
                    yield* value.entries(true);
                else
                    yield [key, value];
            }
        }
        else {
            yield* super.entries();
        }
    }
    /**
     * Returns an object literal composed of all children serialized recursively.
     */
    toJSON() {
        return Object.fromEntries([...this.entries()].map(([key, value]) => [key, value.toJSON()]));
    }
    /**
     * Check whether or not the value is a SchemaFolder.
     * @since 0.6.0
     * @param value The value to check.
     */
    static is(value) {
        return value.type === 'Folder';
    }
}
exports.Schema = Schema;
const SchemaFolder_1 = require("./SchemaFolder");
const SchemaEntry_1 = require("./SchemaEntry");
//# sourceMappingURL=Schema.js.map