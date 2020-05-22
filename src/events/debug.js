import { Event } from 'klasa';

export class extends Event {

	run(warning) {
		if (this.client.ready) this.client.console.debug(warning);
	}

	init() {
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

};
