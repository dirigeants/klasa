import { Event } from '@klasa/core';

export default class extends Event {

	public run(error: { code: number, reason: string }): void {
		this.client.emit('error', `Disconnected | ${error.code}: ${error.reason}`);
	}

}
