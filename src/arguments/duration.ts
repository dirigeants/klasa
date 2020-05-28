import { Argument, Possible } from 'klasa';
import { Duration } from '@klasa/duration';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Date {
		const date = new Duration(argument).fromNow;
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		throw message.language.get('RESOLVER_INVALID_DURATION', possible.name);
	}

}
