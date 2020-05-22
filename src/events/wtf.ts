import { Event } from '@klasa/core';

export default class extends Event {

	run(failure) {
		this.client.console.wtf(failure);
	}

	init() {
		if (!this.client.options.consoleEvents.wtf) this.disable();
	}

}
