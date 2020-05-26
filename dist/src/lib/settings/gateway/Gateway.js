"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const request_handler_1 = require("@klasa/request-handler");
const GatewayStorage_1 = require("./GatewayStorage");
const Settings_1 = require("../Settings");
const cache_1 = require("@klasa/cache");
class Gateway extends GatewayStorage_1.GatewayStorage {
    constructor(client, name, options = {}) {
        super(client, name, options);
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
        /* if (this.schema.size !== 0) {
            // istanbul ignore next: Hard to coverage test the catch
            settings.sync(true).catch(error => this.client.emit('wtf', error));
        } */
        return settings;
    }
    /**
     * Runs a synchronization task for the gateway.
     */
    async sync() {
        await this.requestHandler.wait();
        return this;
    }
}
exports.Gateway = Gateway;
//# sourceMappingURL=Gateway.js.map