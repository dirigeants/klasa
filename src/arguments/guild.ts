import { Argument } from 'klasa';

export default class CoreArgument extends Argument {

	run(arg, possible, message) {
		const guild = this.constructor.regex.snowflake.test(arg) ? this.client.guilds.get(arg) : null;
		if (guild) return guild;
		throw message.language.get('RESOLVER_INVALID_GUILD', possible.name);
	}

}
