import { Event, Message } from '@klasa/core';
import { codeblock } from 'discord-md-tags';

import type { Argument } from 'klasa';

export default class extends Event {

	public async run(message: Message, argument: Argument, _params: readonly unknown[], error: Error | string): Promise<void> {
		if (error instanceof Error) this.client.emit('wtf', `[ARGUMENT] ${argument.path}\n${error.stack || error}`);
		if (typeof error === 'string') await message.reply(mb => mb.setContent(error));
		else await message.reply(mb => mb.setContent(codeblock('JSON') `${error.message}`));
	}

}
