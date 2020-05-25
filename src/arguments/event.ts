import { Argument, Possible, KlasaMessage } from 'klasa';
import { Event } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Event {
		const event = this.client.events.get(argument);
		if (event) return event;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'event');
	}

}
