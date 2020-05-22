import { Event } from 'klasa';

export class extends Event {

	constructor(...args) {
		super(...args, { event: 'message' });
	}

	run(message) {
		if (this.client.ready) this.client.monitors.run(message);
	}

};
