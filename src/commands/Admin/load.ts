import { Command, CommandStore } from 'klasa';
import { Stopwatch } from '@klasa/stopwatch';
import { pathExists } from 'fs-nextra';
import { join } from 'path';

import type { Message, Store, Piece } from '@klasa/core';

export default class extends Command {

	private readonly regExp = /\\\\?|\//g;

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			aliases: ['l'],
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_LOAD_DESCRIPTION'),
			usage: '[core] <Store:store> <path:...string>',
			usageDelim: ' '
		});
	}

	async run(message: Message, [core, store, rawPath]: [string, Store<Piece>, string]): Promise<Message[]> {
		const path = (rawPath.endsWith('.js') ? rawPath : `${rawPath}.js`).split(this.regExp);
		const timer = new Stopwatch();
		const piece = await (core ? this.tryEach(store, path) : store.load(store.userDirectory, path));

		try {
			if (!piece) throw message.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			return message.replyLocale('COMMAND_LOAD', [timer.stop(), store.name, piece.name]);
		} catch (error) {
			timer.stop();
			throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

	private async tryEach(store: Store<Piece>, path: readonly string[]) {
		// eslint-disable-next-line dot-notation
		for (const dir of store['coreDirectories']) if (await pathExists(join(dir, ...path))) return store.load(dir, path);
		return undefined;
	}

}
