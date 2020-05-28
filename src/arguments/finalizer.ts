import { Argument, Finalizer, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Finalizer {
		const finalizer = this.client.finalizers.get(argument);
		if (finalizer) return finalizer;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'finalizer');
	}

}
