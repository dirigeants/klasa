import { Command } from './Command';
import { AliasStore } from '@klasa/core';

/**
 * Stores all the commands usable in Klasa
 * @extends AliasStore
 */
export class CommandStore extends AliasStore {

	/**
	 * Constructs our CommandStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
		super(client, 'commands', Command);
	}

}
