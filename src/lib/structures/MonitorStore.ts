import { Monitor } from './Monitor';
import { Store, PieceConstructor } from '@klasa/core';

import type { KlasaClient } from '../Client';
import type { KlasaMessage } from '../extensions/KlasaMessage';

/**
 * Stores all {@link Monitor} pieces for use in Klasa.
 * @since 0.0.1
 */
export class MonitorStore extends Store<Monitor> {

	/**
	 * Constructs our MonitorStore for use in Klasa.
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: KlasaClient) {
		super(client, 'monitors', Monitor as PieceConstructor<Monitor>);
	}

	/**
	 * Runs our monitors on the message.
	 * @since 0.0.1
	 * @param message The message to be used in the {@link Monitor monitors}.
	 */
	public run(message: KlasaMessage): void {
		// todo: remove console log
		console.log(message);
		// eslint-disable-next-line dot-notation
		for (const monitor of this.values()) if (monitor.shouldRun(message)) monitor['_run'](message);
	}

}
