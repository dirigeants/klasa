import { Argument, ArgumentStore, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['str'] });
	}

	public run(argument: string, possible: Possible, message: Message): string | null {
		if (!argument) throw message.language.get('RESOLVER_INVALID_STRING', possible.name);
		const { min, max } = possible;
		return Argument.minOrMax(this.client, argument.length, min, max, possible, message, 'RESOLVER_STRING_SUFFIX') ? argument : null;
	}

}
