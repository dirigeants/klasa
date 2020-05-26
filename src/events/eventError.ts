import { Event } from '@klasa/core';

export default class extends Event {

	public run(event: Event, _args: readonly unknown[], error: Error): void {
		this.client.emit('wtf', `[EVENT] ${event.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

}
