import { Event } from '@klasa/core';

export default class extends Event {

	public run(warning: Error): void {
		if (this.client.ready) this.client.console.debug(warning);
	}

	public init(): void {
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

}
