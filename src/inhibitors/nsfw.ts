import { Inhibitor, Command } from 'klasa';
import { ChannelType } from '@klasa/dapi-types';

import type { Message } from '@klasa/core';

export default class extends Inhibitor {

	public run(message: Message, command: Command): void {
		if (command.nsfw && message.channel.type !== ChannelType.DM && !message.channel.nsfw) throw message.language.get('INHIBITOR_NSFW');
	}

}
