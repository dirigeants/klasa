import { PieceConstructor, Store } from '@klasa/core';
import { Provider } from './Provider';
import type { KlasaClient } from '../Client';

export class ProviderStore extends Store<Provider> {

	/**
	 * Constructs our ProviderStore for use in Klasa.
	 * @param client The client that instantiates this store
	 */
	public constructor(client: KlasaClient) {
		super(client, 'monitors', Provider as PieceConstructor<Provider>);
	}

	/**
	 * The default provider set in ClientOptions.providers
	 */
	public get default(): Provider | null {
		return this.get(this.client.options.providers.default as string) || null;
	}

	/**
	 * Clears the providers from the store and waits for them to shutdown.
	 */
	public clear(): void {
		for (const provider of this.values()) this.remove(provider);
	}

	/**
	 * Deletes a provider from the store.
	 * @param name The Provider instance or its name
	 */
	public remove(name: string | Provider): boolean {
		const provider = this.resolve(name);
		if (!provider) return false;

		/* istanbul ignore next: Hard to coverage test the catch */
		Promise.resolve(provider.shutdown()).catch((error) => this.client.emit('wtf', error));
		return super.remove(provider);
	}

}
