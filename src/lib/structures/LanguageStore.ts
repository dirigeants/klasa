import { Language } from './Language';
import { Store, PieceConstructor } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all languages for use in Klasa
 * @extends Store
 */
export class LanguageStore extends Store<Language> {

	constructor(client: KlasaClient) {
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
