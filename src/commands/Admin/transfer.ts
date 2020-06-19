import { Command, CommandStore } from 'klasa';
import { copy } from 'fs-nextra';
import { promises as fsp } from 'fs';
import { resolve, join } from 'path';

import type { Piece, Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_TRANSFER_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: Message, [piece]: [Piece]): Promise<Message[]> {
		const file = join(...piece.file);
		const fileLocation = resolve(piece.directory, file);
		await fsp.access(fileLocation).catch(() => { throw message.language.get('COMMAND_TRANSFER_ERROR'); });
		try {
			await copy(fileLocation, join(piece.store.userDirectory, file));
			piece.store.load(piece.store.userDirectory, piece.file);
			return message.replyLocale('COMMAND_TRANSFER_SUCCESS', [piece.type, piece.name]);
		} catch (err) {
			this.client.emit('error', err.stack);
			return message.replyLocale('COMMAND_TRANSFER_FAILED', [piece.type, piece.name]);
		}
	}

}
