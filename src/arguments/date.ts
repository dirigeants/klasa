import { Argument, KlasaMessage, Possible } from 'klasa';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Date {
		const date = new Date(argument);
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw message.language.get('RESOLVER_INVALID_DATE', possible.name);
	}

}
