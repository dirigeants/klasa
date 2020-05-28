import { Argument, Possible, Provider } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Provider {
		const provider = this.client.providers.get(argument);
		if (provider) return provider;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'provider');
	}

}
