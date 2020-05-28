import { Argument, Possible, Monitor } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Monitor {
		const monitor = this.client.monitors.get(argument);
		if (monitor) return monitor;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'monitor');
	}

}
