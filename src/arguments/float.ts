import { Argument, ArgumentStore, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['num', 'number'] });
	}

	public run(argument: string, possible: Possible, message: Message): number | null {
		const { min, max } = possible;
		const number = parseFloat(argument);
		if (Number.isNaN(number)) throw message.language.get('RESOLVER_INVALID_FLOAT', possible.name);
		return Argument.minOrMax(this.client, number, min, max, possible, message) ? number : null;
	}

}
