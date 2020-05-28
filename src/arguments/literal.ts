import { Argument, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): string {
		if (argument.toLowerCase() === possible.name.toLowerCase()) return possible.name;
		throw message.language.get('RESOLVER_INVALID_LITERAL', possible.name);
	}

}
