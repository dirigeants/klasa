import { Finalizer } from './Finalizer';
import { Store, PieceConstructor } from '@klasa/core';

import type { KlasaClient } from '../Client';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { Command } from './Command';
import { Stopwatch } from '../util/Stopwatch';

/**
 * Stores all finalizers for use in Klasa.
 * @extends Store
 */
export class FinalizerStore extends Store<Finalizer> {

	constructor(client: KlasaClient) {
		super(client, 'finalizers', Finalizer as PieceConstructor<Finalizer>);
	}

	/**
	 * Runs all of our finalizers after a command is ran successfully.
	 * @since 0.0.1
	 * @param message The message that called the command
	 * @param command The command this finalizer is for (may be different than message.command)
	 * @param response The response of the command
	 * @param timer The timer run from start to queue of the command
	 */
	public run(message: KlasaMessage, command: Command, response: KlasaMessage | KlasaMessage[], timer: Stopwatch): void {
		// eslint-disable-next-line dot-notation
		for (const finalizer of this.values()) if (finalizer.enabled) finalizer['_run'](message, command, response, timer);
	}

}
