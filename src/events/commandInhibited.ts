import { Event } from '@klasa/core';
import type { Command, KlasaMessage } from 'klasa';

export default class extends Event {

	public run(message: KlasaMessage, _command: Command, response: string): void {
		if (response && response.length) message.send(mb => mb.setContent(response));
	}

}
