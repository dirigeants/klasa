import { Event } from '@klasa/core';

export default class extends Event {

	public run(failure: string | Error): void {
		this.client.console.wtf(failure);
	}

	public init(): void {
		if (!this.client.options.consoleEvents.wtf) this.disable();
	}

}
