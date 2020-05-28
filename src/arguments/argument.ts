import { Argument, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Argument {
		const entry = this.client.arguments.get(argument);
		if (entry) return entry;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'argument');
	}

}
