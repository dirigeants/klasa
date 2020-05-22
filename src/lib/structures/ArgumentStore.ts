import { AliasStore } from '@klasa/core';
import { Argument } from './Argument';

/**
 * Stores all the arguments usable in Klasa
 * @extends AliasStore
 */
export class ArgumentStore extends AliasStore {

	/**
	 * Constructs our ArgumentStore for use in Klasa
	 * @since 0.5.0
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client, 'arguments', Argument);
	}

}
