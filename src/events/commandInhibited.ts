import { Event, Message } from '@klasa/core';

import type { Command } from 'klasa';

export default class extends Event {

	public run(message: Message, _command: Command, response: string): void {
		if (response && response.length) message.send(mb => mb.setContent(response));
	}

}
