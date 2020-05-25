import { Event, EventStore } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { emitter: process });
		if (this.client.options.production) this.unload();
	}

	public run(error: Error): void {
		if (!error) return;
		this.client.emit('error', `Uncaught Promise Error: \n${error.stack || error}`);
	}

}
