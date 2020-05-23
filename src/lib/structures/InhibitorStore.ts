import { Inhibitor } from './Inhibitor';
import { Store } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all the inhibitors in Klasa
 * @extends Store
 */
export class InhibitorStore extends Store<Inhibitor> {

	constructor(client: KlasaClient) {
		super(client, 'inhibitors', Inhibitor);
	}

	/**
	 * Runs our inhibitors on the command.
	 * @since 0.0.1
	 * @param {KlasaMessage} message The message object from @klasa/core
	 * @param {Command} command The command being ran.
	 * @param {boolean} [selective=false] Whether or not we should ignore certain inhibitors to prevent spam.
	 * @returns {void}
	 */
	async run(message, command, selective = false) {
		const mps = [];
		for (const inhibitor of this.values()) if (inhibitor.enabled && (!selective || !inhibitor.spamProtection)) mps.push(inhibitor._run(message, command));
		const results = (await Promise.all(mps)).filter(res => res);
		if (results.includes(true)) throw undefined;
		if (results.length) throw results;
		return undefined;
	}

}
