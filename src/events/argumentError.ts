import { Event } from '@klasa/core';
import type { Argument, KlasaMessage } from 'klasa';

export default class extends Event {

	public run(message: KlasaMessage, _argument: Argument, _params: readonly unknown[], error: string): void {
		message.send(mb => mb.setContent(error)).catch(err => this.client.emit('wtf', err));
	}

}
