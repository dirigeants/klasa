import { Monitor } from './Monitor';
import { Store } from '@klasa/core';

/**
 * Stores all monitors for use in Klasa
 * @extends Store
 */
export class MonitorStore extends Store {

	/**
	 * Constructs our MonitorStore for use in Klasa
	 * @since 0.0.1
	 * @param {KlasaClient} client The Klasa Client
	 */
	constructor(client) {
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
