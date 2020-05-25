import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_INVITE_DESCRIPTION')
		});
	}

	public async run(message: KlasaMessage): Promise<Message[]> {
		return message.sendLocale('COMMAND_INVITE');
	}

	public async init(): Promise<void> {
		if (this.client.application && !this.client.application.botPublic) this.permissionLevel = 10;
	}

}
