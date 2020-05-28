import { Event, EventStore, Message } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageUpdate' });
	}

	public run(message: Message, previous: Message): void {
		if (previous.content !== message.content) this.client.monitors.run(message);
	}

}
