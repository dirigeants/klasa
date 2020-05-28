import { Argument, Language, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Language {
		const language = this.client.languages.get(argument);
		if (language) return language;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'language');
	}

}
