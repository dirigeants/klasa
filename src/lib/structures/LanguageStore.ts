import { Language } from './Language';
import { Store } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all languages for use in Klasa
 * @extends Store
 */
export class LanguageStore extends Store<Language> {

	constructor(client: KlasaClient) {
		super(client, 'languages', Language);
	}

	/**
	 * The default language set in {@link KlasaClientOptions.language}
	 * @since 0.2.1
	 * @type {?Language}
	 * @readonly
	 */
	get default() {
		return this.get(this.client.options.language) || null;
	}

}
