import { Event } from '@klasa/core';

export default class extends Event {

	run(err) {
		this.client.emit('error', `Disconnected | ${err.code}: ${err.reason}`);
	}

}
