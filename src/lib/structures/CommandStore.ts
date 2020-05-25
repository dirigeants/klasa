import { Command } from './Command';
import { AliasStore, PieceConstructor } from '@klasa/core';

import type { KlasaClient } from '../Client';

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
	public constructor(client: KlasaClient) {
		super(client, 'commands', Command as PieceConstructor<Command>);
	}

}
