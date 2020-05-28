import { Command } from './Command';
import { AliasStore, PieceConstructor, Client } from '@klasa/core';

/**
 * Stores all {@link Command} pieces for use in Klasa.
 * @since 0.0.1
 */
export class CommandStore extends AliasStore<Command> {

	/**
	 * Constructs our CommandStore for use in Klasa.
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'commands', Command as PieceConstructor<Command>);
	}

}
