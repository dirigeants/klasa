import { Event, EventStore } from '@klasa/core';
import type { KlasaMessage } from 'klasa';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageDeleteBulk' });
	}

	public run(messages: KlasaMessage[]): void {
		for (const message of messages.values()) {
			if (message.command && message.command.deletable) {
				for (const msg of message.responses) {
					if (!msg.deleted) msg.delete().catch(error => this.client.emit('error', error));
				}
			}
		}
	}

}
