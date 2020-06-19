import { Event, Message } from '@klasa/core';

import type { Command } from 'klasa';

export default class extends Event {

	public async run(message: Message, _command: Command, response: string): Promise<void> {
		if (response && response.length) await message.reply(mb => mb.setContent(response));
	}

}
