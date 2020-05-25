import { Argument, KlasaMessage, Possible } from 'klasa';
import { Duration } from '@klasa/duration';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Date {
		const date = new Duration(argument).fromNow;
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw message.language.get('RESOLVER_INVALID_DURATION', possible.name);
	}

}
