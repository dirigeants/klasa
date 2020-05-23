import { Provider } from './Provider';
import { Store } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all providers for use in Klasa
 * @extends Store
 */
export class ProviderStore extends Store<Provider> {

	constructor(client: KlasaClient) {
		super(client, 'providers', Provider);
	}

	/**
	 * The default provider set in {@link KlasaClientOptions.providers}
	 * @since 0.5.0
	 * @type {?Provider}
	 * @readonly
	 */
	get default() {
		return this.get(this.client.options.providers.default) || null;
	}

	/**
	 * Clears the providers from the store and waits for them to shutdown.
	 * @since 0.0.1
	 */
	clear() {
		for (const provider of this.values()) this.delete(provider);
	}

	/**
	 * Deletes a provider from the store
	 * @since 0.0.1
	 * @param {Provider|string} name The provider object or a string representing the structure this store caches
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const pro = this.resolve(name);
		if (!pro) return false;
		pro.shutdown();
		return super.delete(pro);
	}

}
