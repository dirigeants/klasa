import { PieceConstructor, Store, Client } from '@klasa/core';
import { Provider } from './Provider';

/**
 * Stores all {@link Provider} pieces for use in Klasa.
 * @since 0.1.0
 */
export class ProviderStore extends Store<Provider> {

	/**
	 * Constructs our ProviderStore for use in Klasa.
	 * @since 0.1.0
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'providers', Provider as PieceConstructor<Provider>);
	}

	/**
	 * The default provider set in ClientOptions.providers.
	 * @since 0.1.0
	 */
	public get default(): Provider | null {
		return this.get(this.client.options.providers.default as string) || null;
	}

	/**
	 * Clears the providers from the store and waits for them to shutdown.
	 * @since 0.1.0
	 */
	public clear(): void {
		for (const provider of this.values()) this.remove(provider);
	}

	/**
	 * Deletes a provider from the store.
	 * @since 0.6.0
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
