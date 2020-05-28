import { Inhibitor, Command } from 'klasa';

import type { Message } from '@klasa/core';

export default class extends Inhibitor {

	public run(message: Message, command: Command): boolean {
		return command.hidden && message.command !== command && !this.client.owners.has(message.author);
	}

}
