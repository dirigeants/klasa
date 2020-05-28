import { Event, EventStore, Message } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageDeleteBulk' });
	}

	public async run(messages: Message[]): Promise<void> {
		for (const message of messages.values()) {
			if (message.command && message.command.deletable) {
				for (const msg of message.responses) {
					if (!msg.deleted) await msg.delete();
				}
			}
		}
	}

}
