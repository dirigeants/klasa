import { Event } from '@klasa/core';

export default class extends Event {

	run(warning) {
		this.client.console.warn(warning);
	}

	init() {
		if (!this.client.options.consoleEvents.warn) this.disable();
	}

}
