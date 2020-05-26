import { Event } from '@klasa/core';

export default class extends Event {

	public run(log: string): void {
		this.client.console.verbose(log);
	}

	public init(): void {
		if (!this.client.options.consoleEvents.verbose) this.disable();
	}

}
