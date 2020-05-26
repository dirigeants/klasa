import { Event } from '@klasa/core';

export default class extends Event {

	public run(error: Error): void {
		this.client.console.error(error);
	}

	public init(): void {
		if (!this.client.options.consoleEvents.error) this.disable();
	}

}
