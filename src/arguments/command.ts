import { Argument, ArgumentStore, Command, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['cmd'] });
	}

	public run(argument: string, possible: Possible, message: Message): Command {
		const command = this.client.commands.get(argument.toLowerCase());
		if (command) return command;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'command');
	}

}
