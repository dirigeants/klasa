import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message, Piece } from '@klasa/core';
import { codeblock } from 'discord-md-tags';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_DISABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: Piece[]): Promise<Message[]> {
		if ((piece.type === 'event' && piece.name === 'coreMessage') ||
		(piece.type === 'monitor' && piece.name === 'commandHandler') ||
		(piece.type === 'action' && piece.name === 'MESSAGE_CREATE')) {
			return message.sendLocale('COMMAND_DISABLE_WARN');
		}
		piece.disable();
		return message.send(mb => mb.setContent(codeblock('diff') `${message.language.get('COMMAND_DISABLE', [piece.type, piece.name])}`));
	}

}
