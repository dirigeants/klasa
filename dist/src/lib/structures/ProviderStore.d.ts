import { Store } from '@klasa/core';
import { Provider } from './Provider';
import type { KlasaClient } from '../Client';
/**
 * Stores all {@link Provider} pieces for use in Klasa.
 * @since 0.1.0
 */
export declare class ProviderStore extends Store<Provider> {
    /**
     * Constructs our ProviderStore for use in Klasa.
     * @since 0.1.0
     * @param client The Klasa client
     */
    constructor(client: KlasaClient);
    /**
     * The default provider set in ClientOptions.providers.
     * @since 0.1.0
     */
    get default(): Provider | null;
    /**
     * Clears the providers from the store and waits for them to shutdown.
     * @since 0.1.0
     */
    clear(): void;
    /**
     * Deletes a provider from the store.
     * @since 0.6.0
     * @param name The Provider instance or its name
     */
    remove(name: string | Provider): boolean;
}
