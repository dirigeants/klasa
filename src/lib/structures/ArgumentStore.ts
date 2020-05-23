import { AliasStore } from '@klasa/core';
import { Argument } from './Argument';

import type { KlasaClient } from '../Client';

/**
 * Stores all the arguments usable in Klasa
 * @extends AliasStore
 */
export class ArgumentStore extends AliasStore<Argument> {

	constructor(client: KlasaClient) {
		super(client, 'arguments', Argument);
	}

}
