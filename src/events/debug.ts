import { Event } from '@klasa/core';

export default class extends Event {

	run(warning) {
		if (this.client.ready) this.client.console.debug(warning);
	}

	init() {
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

}
