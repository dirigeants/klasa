import { Event } from '@klasa/core';

export default class extends Event {

	constructor(...args) {
		super(...args, { event: 'message' });
	}

	run(message) {
		if (this.client.ready) this.client.monitors.run(message);
	}

}
