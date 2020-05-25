import { Command, CommandStore, KlasaMessage } from 'klasa';
import * as fs from 'fs-nextra';
import { resolve, join } from 'path';
import { Piece, Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_TRANSFER_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: [Piece]): Promise<Message[]> {
		const file = join(...piece.file);
		const fileLocation = resolve(piece.directory, file);
		await fs.access(fileLocation).catch(() => { throw message.language.get('COMMAND_TRANSFER_ERROR'); });
		try {
			await fs.copy(fileLocation, join(piece.store.userDirectory, file));
			piece.store.load(piece.store.userDirectory, piece.file);
			return message.sendLocale('COMMAND_TRANSFER_SUCCESS', [piece.type, piece.name]);
		} catch (err) {
			this.client.emit('error', err.stack);
			return message.sendLocale('COMMAND_TRANSFER_FAILED', [piece.type, piece.name]);
		}
	}

}
