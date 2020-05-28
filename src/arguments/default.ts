import { Argument, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): string {
		const literal = possible.name.toLowerCase();
		if (typeof argument === 'undefined' || argument.toLowerCase() !== literal) message.args.splice(message.params.length, 0, undefined);
		return literal;
	}

}
