import { Inhibitor } from './Inhibitor';
import { Store, PieceConstructor, Client, Message } from '@klasa/core';

import type { Command } from './Command';

/**
 * Stores all {@link Inhibitor} pieces for use in Klasa
 */
export class InhibitorStore extends Store<Inhibitor> {

	/**
	 * Constructs our InhibitorStore for use in Klasa.
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'inhibitors', Inhibitor as PieceConstructor<Inhibitor>);
	}

	/**
	 * Runs our inhibitors on the command.
	 * @since 0.0.1
	 * @param message The message object from @klasa/core
	 * @param command The command being ran.
	 * @param selective Whether or not we should ignore certain inhibitors to prevent spam.
	 */
	public async run(message: Message, command: Command, selective = false): Promise<void> {
		const mps = [];
		// eslint-disable-next-line dot-notation
		for (const inhibitor of this.values()) if (inhibitor.enabled && (!selective || !inhibitor.spamProtection)) mps.push(inhibitor['_run'](message, command));
		const results = (await Promise.all(mps)).filter(res => res);
		if (results.includes(true)) throw undefined;
		if (results.length) throw results;
	}

}
