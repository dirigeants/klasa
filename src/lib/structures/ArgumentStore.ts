import { AliasStore, PieceConstructor } from '@klasa/core';
import { Argument } from './Argument';

import type { KlasaClient } from '../Client';

/**
 * Stores all the arguments usable in Klasa
 * @extends AliasStore
 */
export class ArgumentStore extends AliasStore<Argument> {

	public constructor(client: KlasaClient) {
		super(client, 'arguments', Argument as PieceConstructor<Argument>);
	}

}
