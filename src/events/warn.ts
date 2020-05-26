import { Event } from '@klasa/core';

export default class extends Event {

	public run(warning: string | Error): void {
		this.client.console.warn(warning);
	}

	public init(): void {
		if (!this.client.options.consoleEvents.warn) this.disable();
	}

}
