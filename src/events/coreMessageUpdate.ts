import { Event, EventStore } from '@klasa/core';
import type { KlasaMessage } from 'klasa';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageUpdate' });
	}

	public run(message: KlasaMessage, previous: KlasaMessage): void {
		if (previous.content !== message.content) this.client.monitors.run(message);
	}

}
