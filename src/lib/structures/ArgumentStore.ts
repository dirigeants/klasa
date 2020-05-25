import { AliasStore, PieceConstructor } from '@klasa/core';
import { Argument } from './Argument';

import type { KlasaClient } from '../Client';

/**
 * Stores all {@link Argument} pieces for use in Klasa.
 * @since 0.0.1
 */
export class ArgumentStore extends AliasStore<Argument> {

	/**
	 * Constructs our ArgumentStore for use in Klasa.
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: KlasaClient) {
		super(client, 'arguments', Argument as unknown as PieceConstructor<Argument>);
	}

}
