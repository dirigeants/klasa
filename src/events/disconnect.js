import { Event } from 'klasa';

export class extends Event {

	run(err) {
		this.client.emit('error', `Disconnected | ${err.code}: ${err.reason}`);
	}

};
