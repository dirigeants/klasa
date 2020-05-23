import { Command } from './Command';
import { AliasStore } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all the commands usable in Klasa
 * @extends AliasStore
 */
export class CommandStore extends AliasStore<Command> {

	constructor(client: KlasaClient) {
		super(client, 'commands', Command);
	}

}
