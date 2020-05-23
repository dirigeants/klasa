import { Finalizer } from './Finalizer';
import { Store } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all finalizers for use in Klasa.
 * @extends Store
 */
export class FinalizerStore extends Store<Finalizer> {

	constructor(client: KlasaClient) {
		super(client, 'finalizers', Finalizer);
	}

	/**
	 * Runs all of our finalizers after a command is ran successfully.
	 * @since 0.0.1
	 * @param {KlasaMessage} message The message that called the command
	 * @param {Command} command The command this finalizer is for (may be different than message.command)
	 * @param {KlasaMessage|any} response The response of the command
	 * @param {StopWatch} timer The timer run from start to queue of the command
	 * @returns {void}
	 */
	run(message, command, response, timer) {
		for (const finalizer of this.values()) if (finalizer.enabled) finalizer._run(message, command, response, timer);
	}

}
