import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Stopwatch } from '@klasa/stopwatch';
import { pathExists } from 'fs-nextra';
import { join } from 'path';
import { Message, Store, Piece } from '@klasa/core';

export default class extends Command {

	private regExp: RegExp;

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			aliases: ['l'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_LOAD_DESCRIPTION'),
			usage: '[core] <Store:store> <path:...string>',
			usageDelim: ' '
		});
		this.regExp = /\\\\?|\//g;
	}

	async run(message: KlasaMessage, [core, store, path]: [string, Store<Piece>, string]): Promise<Message[]> {
		path = (path.endsWith('.js') ? path : `${path}.js`).split(this.regExp);
		const timer = new Stopwatch();
		const piece = await (core ? this.tryEach(store, path) : store.load(store.userDirectory, path));

		try {
			if (!piece) throw message.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			return message.sendLocale('COMMAND_LOAD', [timer.stop(), store.name, piece.name]);
		} catch (error) {
			timer.stop();
			throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

	async tryEach(store: Store<Piece>, path: string) {
		for (const dir of store.coreDirectories) if (await pathExists(join(dir, ...path))) return store.load(dir, path);
		return undefined;
	}

}
