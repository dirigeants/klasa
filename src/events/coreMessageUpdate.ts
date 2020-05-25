import { Event, EventStore } from '@klasa/core';
import type { KlasaMessage } from 'klasa';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'messageUpdate' });
	}

	public run(previous: KlasaMessage, message: KlasaMessage): void {
		if (this.client.ready && previous.content !== message.content) this.client.monitors.run(message);
	}

}
