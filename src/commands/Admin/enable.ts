import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Message, Piece } from '@klasa/core';
import { codeblock } from 'discord-md-tags';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_ENABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: Piece[]): Promise<Message[]> {
		piece.enable();
		return message.send(mb => mb.setContent(codeblock('diff') `${message.language.get('COMMAND_ENABLE', [piece.type, piece.name])}`));
	}

}
