import { Language } from './Language';
import { Store, PieceConstructor, Client } from '@klasa/core';

/**
 * Stores all {@link Language} pieces for use in Klasa.
 * @since 0.0.1
 */
export class LanguageStore extends Store<Language> {

	/**
	 * Constructs our LanguageStore for use in Klasa.
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'languages', Language as PieceConstructor<Language>);
	}

	/**
	 * The default language set in {@link KlasaClientOptions.language}
	 * @since 0.2.1
	 */
	public get default(): Language {
		return this.get(this.client.options.language) as Language;
	}

}
