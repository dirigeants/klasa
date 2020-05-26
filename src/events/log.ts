import { Event } from '@klasa/core';

export default class extends Event {

	public run(data: string): void {
		this.client.console.log(data);
	}

	public init(): void {
		if (!this.client.options.consoleEvents.log) this.disable();
	}

}
