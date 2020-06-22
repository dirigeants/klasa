"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _provider;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const request_handler_1 = require("@klasa/request-handler");
const cache_1 = require("@klasa/cache");
const Settings_1 = require("../Settings");
const Schema_1 = require("../schema/Schema");
class Gateway {
    constructor(client, name, options = {}) {
        var _a;
        /**
         * Whether or not this gateway has been initialized.
         */
        this.ready = false;
        /**
         * The provider's name that manages this gateway.
         */
        _provider.set(this, void 0);
        this.client = client;
        this.name = name;
        this.schema = options.schema || new Schema_1.Schema();
        __classPrivateFieldSet(this, _provider, (_a = options.provider) !== null && _a !== void 0 ? _a : client.options.providers.default);
        this.cache = (this.name in this.client) && (this.client[this.name] instanceof Map) ?
            this.client[this.name] :
            new cache_1.Cache();
        this.requestHandler = new request_handler_1.RequestHandler((id) => {
            const { provider } = this;
            return provider === null ?
                Promise.reject(new Error('Cannot run requests without a provider available.')) :
                provider.get(this.name, id);
        }, (ids) => {
            const { provider } = this;
            return provider === null ?
                Promise.reject(new Error('Cannot run requests without a provider available.')) :
                provider.getAll(this.name, ids);
        });
    }
    /**
     * Gets an entry from the cache or creates one if it does not exist
     * @param target The target that holds a Settings instance of the holder for the new one
     * @param id The settings' identificator
     * @example
     * // Retrieve a members gateway
     * const gateway = this.client.gateways.get('members');
     *
     * // Acquire a settings instance belonging to a member
     * gateway.acquire(message.member);
     */
    acquire(target, id = target.id) {
        return this.get(id) || this.create(target, id);
    }
    /**
     * Get an entry from the cache.
     * @param id The key to get from the cache
     * @example
     * // Retrieve a members gateway
     * const gateway = this.client.gateways.get('members');
     *
     * // Retrieve a settings instance belonging to a member's id
     * const settings = gateway.get(someMemberID);
     *
     * // Do something with it, be careful as it can return null
     * if (settings === null) {
     *     // settings is null
     * } else {
     *     // console.log(settings);
     * }
     */
    get(id) {
        const entry = this.cache.get(id);
        return (entry && entry.settings) || null;
    }
    /**
     * Create a new Settings instance for this gateway.
     * @param target The target that will hold this instance alive
     * @param id The settings' identificator
     */
    create(target, id = target.id) {
        const settings = new Settings_1.Settings(this, target, id);
        if (this.schema.size !== 0) {
            // istanbul ignore next: Hard to coverage test the catch
            settings.sync(true).catch(error => this.client.emit('wtf', error));
        }
        return settings;
    }
    /**
     * The provider that manages this gateway's persistent data.
     */
    get provider() {
        var _a;
        return (_a = this.client.providers.get(__classPrivateFieldGet(this, _provider))) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Initializes the gateway.
     */
    async init() {
        // Gateways must not initialize twice.
        if (this.ready)
            throw new Error(`The gateway "${this.name}" has already been initialized.`);
        // Check the provider's existence.
        const { provider } = this;
        if (provider === null)
            throw new Error(`The gateway "${this.name}" could not find the provider "${__classPrivateFieldGet(this, _provider)}".`);
        this.ready = true;
        const errors = [...this._initializeSchemaEntries(this.schema)];
        if (errors.length)
            throw new Error(`[SCHEMA] There is an error with your schema.\n${errors.join('\n')}`);
        // Initialize the defaults
        // eslint-disable-next-line dot-notation
        this.schema.defaults['_init']();
        // Init the table
        const hasTable = await provider.hasTable(this.name);
        if (!hasTable)
            await provider.createTable(this.name);
        // Add any missing columns (NoSQL providers return empty array)
        const columns = await provider.getColumns(this.name);
        if (columns.length) {
            const promises = [];
            for (const entry of this.schema.values()) {
                if (!columns.includes(entry.key))
                    promises.push(provider.addColumn(this.name, entry));
            }
            await Promise.all(promises);
        }
        await this.sync();
    }
    /**
     * Runs a synchronization task for the gateway.
     */
    async sync() {
        await this.requestHandler.wait();
        return this;
    }
    /**
     * Get A JSON object containing the schema and the options.
     */
    toJSON() {
        return {
            name: this.name,
            provider: __classPrivateFieldGet(this, _provider),
            schema: this.schema.toJSON()
        };
    }
    *_initializeSchemaEntries(schema) {
        // Iterate over all the schema's values
        for (const value of schema.values()) {
            // Set the client and check if it is valid, afterwards freeze,
            // otherwise delete it from its parent and yield error message
            value.client = this.client;
            try {
                value._check();
                Object.freeze(value);
            }
            catch (error) {
                // If errored, delete the key from its parent
                value.parent.delete(value.key);
                yield error.message;
            }
        }
        // Set the schema as ready
        schema.ready = true;
    }
}
exports.Gateway = Gateway;
_provider = new WeakMap();
//# sourceMappingURL=Gateway.js.map