import { Command, CommandStore } from 'klasa';
import { Piece, Store, Message } from '@klasa/core';
import { Stopwatch } from '@klasa/stopwatch';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			aliases: ['r'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
			usage: '<Store:store|Piece:piece|everything:default>'
		});
	}

	public async run(message: Message, [piece]: [Piece | Store<Piece> | 'everything']): Promise<Message[]> {
		if (piece === 'everything') return this.everything(message);
		if (piece instanceof Store) {
			const timer = new Stopwatch();
			await piece.loadAll();
			await piece.init();
			return message.replyLocale('COMMAND_RELOAD_ALL', [piece, timer.stop()]);
		}

		try {
			const item = await piece.reload();
			if (!item) throw new Error('Failed to reload.');

			const timer = new Stopwatch();
			return message.replyLocale('COMMAND_RELOAD', [item.type, item.name, timer.stop()]);
		} catch (err) {
			piece.store.add(piece);
			return message.replyLocale('COMMAND_RELOAD_FAILED', [piece.type, piece.name]);
		}
	}

	public async everything(message: Message): Promise<Message[]> {
		const timer = new Stopwatch();
		await Promise.all(this.client.pieceStores.map(async (store) => {
			await store.loadAll();
			await store.init();
		}));
		return message.replyLocale('COMMAND_RELOAD_EVERYTHING', [timer.stop()]);
	}

}
