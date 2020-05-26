"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderStore = void 0;
const core_1 = require("@klasa/core");
const Provider_1 = require("./Provider");
/**
 * Stores all {@link Provider} pieces for use in Klasa.
 * @since 0.1.0
 */
class ProviderStore extends core_1.Store {
    /**
     * Constructs our ProviderStore for use in Klasa.
     * @since 0.1.0
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'providers', Provider_1.Provider);
    }
    /**
     * The default provider set in ClientOptions.providers.
     * @since 0.1.0
     */
    get default() {
        return this.get(this.client.options.providers.default) || null;
    }
    /**
     * Clears the providers from the store and waits for them to shutdown.
     * @since 0.1.0
     */
    clear() {
        for (const provider of this.values())
            this.remove(provider);
    }
    /**
     * Deletes a provider from the store.
     * @since 0.6.0
     * @param name The Provider instance or its name
     */
    remove(name) {
        const provider = this.resolve(name);
        if (!provider)
            return false;
        /* istanbul ignore next: Hard to coverage test the catch */
        Promise.resolve(provider.shutdown()).catch((error) => this.client.emit('wtf', error));
        return super.remove(provider);
    }
}
exports.ProviderStore = ProviderStore;
//# sourceMappingURL=ProviderStore.js.map