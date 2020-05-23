import { Monitor } from './Monitor';
import { Store } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all monitors for use in Klasa
 * @extends Store
 */
export class MonitorStore extends Store<Monitor> {

	constructor(client: KlasaClient) {
		super(client, 'monitors', Monitor);
	}

	/**
	 * Runs our monitors on the message.
	 * @since 0.0.1
	 * @param {KlasaMessage} message The message object from @klasa/core
	 */
	run(message) {
		for (const monitor of this.values()) if (monitor.shouldRun(message)) monitor._run(message);
	}

}
