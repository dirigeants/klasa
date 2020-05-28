import { AliasStore, PieceConstructor, Client } from '@klasa/core';
import { Argument } from './Argument';

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
	public constructor(client: Client) {
		super(client, 'arguments', Argument as unknown as PieceConstructor<Argument>);
	}

}
