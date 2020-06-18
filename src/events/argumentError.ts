import { Event, Message } from '@klasa/core';

import type { Argument } from 'klasa';

export default class extends Event {

	public async run(message: Message, _argument: Argument, _params: readonly unknown[], error: string): Promise<void> {
		await message.reply(mb => mb.setContent(error));
	}

}
