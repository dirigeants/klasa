"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const cache_1 = require("@klasa/cache");
const SchemaEntry_1 = require("./SchemaEntry");
const Settings_1 = require("../Settings");
/* eslint-disable no-dupe-class-members */
class Schema extends cache_1.Cache {
    /**
     * Constructs the schema
     */
    constructor() {
        super();
        this.ready = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.defaults = new Settings_1.Settings({ schema: this }, null, '');
        this.defaults.existenceStatus = 0 /* Defaults */;
    }
    /**
     * Adds or replaces an entry to this instance.
     * @param key The key of the entry to add
     * @param value The entry to add
     */
    set(key, value) {
        if (this.ready)
            throw new Error('Cannot modify the schema after being initialized.');
        this.defaults.set(key, value.default);
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
    add(key, type, options) {
        const previous = super.get(key);
        if (typeof previous !== 'undefined') {
            // Edit the previous key
            const schemaEntry = previous;
            schemaEntry.edit({ type, ...options });
            this.defaults.set(key, schemaEntry.default);
            return this;
        }
        this.set(key, new SchemaEntry_1.SchemaEntry(this, key, type, options));
        return this;
    }
    /**
     * Returns an object literal composed of all children serialized recursively.
     */
    toJSON() {
        return Object.fromEntries(this.map((value, key) => [key, value.toJSON()]));
    }
}
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map