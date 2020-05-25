import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message, Piece } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			aliases: ['u'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_UNLOAD_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: [Piece]): Promise<Message[]> {
		if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return message.sendLocale('COMMAND_UNLOAD_WARN');
		}
		piece.unload();
		return message.sendLocale('COMMAND_UNLOAD', [piece.type, piece.name]);
	}

}
