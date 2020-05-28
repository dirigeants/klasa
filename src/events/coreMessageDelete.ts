import { Event, EventStore, Message } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageDelete' });
	}

	public async run(message: Message): Promise<void> {
		if (message.command && message.command.deletable) {
			for (const msg of message.responses) {
				if (!msg.deleted) await msg.delete();
			}
		}
	}

}
