import { Event, EventStore, Message } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageCreate' });
	}

	public run(message: Message): void {
		this.client.monitors.run(message);
	}

}
