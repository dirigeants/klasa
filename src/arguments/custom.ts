import { Argument, Possible, CustomUsageArgument } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: Message, custom: CustomUsageArgument): Promise<unknown> {
		try {
			return await custom(argument, possible, message, message.params);
		} catch (err) {
			if (err) throw err;
			throw message.language.get('RESOLVER_INVALID_CUSTOM', possible.name, possible.type);
		}
	}

}
