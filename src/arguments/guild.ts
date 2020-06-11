import { Argument, Possible } from 'klasa';

import type { Guild, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Guild {
		const guild = Argument.regex.snowflake.test(argument) ? this.client.guilds.get(argument) : null;
		if (guild) return guild;
		throw message.language.get('RESOLVER_INVALID_GUILD', possible.name);
	}

}
