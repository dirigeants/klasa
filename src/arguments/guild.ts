import { Argument, KlasaMessage, Possible } from 'klasa';
import { Guild } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Guild {
		const guild = Argument.regex.snowflake.test(argument) ? this.client.guilds.get(argument) : null;
		if (guild) return guild;
		throw message.language.get('RESOLVER_INVALID_GUILD', possible.name);
	}

}
