import { Command, CommandStore } from 'klasa';

import type { Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			aliases: ['details', 'what'],
			guarded: true,
			description: language => language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	public async run(message: Message): Promise<|Message[]> {
		return message.replyLocale('COMMAND_INFO');
	}

}
