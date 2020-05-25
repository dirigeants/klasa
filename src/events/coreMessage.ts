import { Event, EventStore } from '@klasa/core';
import type { KlasaMessage } from 'src/lib/extensions/KlasaMessage';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'message' });
	}

	public run(message: KlasaMessage): void {
		if (this.client.ready) this.client.monitors.run(message);
	}

}
