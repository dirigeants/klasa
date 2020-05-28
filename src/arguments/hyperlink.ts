import { parse } from 'url';
import { Argument, ArgumentStore, Possible } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['url'] });
	}

	public run(argument: string, possible: Possible, message: Message): string {
		const res = parse(argument);
		const hyperlink = res.protocol && res.hostname ? argument : null;
		if (hyperlink !== null) return hyperlink;
		throw message.language.get('RESOLVER_INVALID_URL', possible.name);
	}

}
