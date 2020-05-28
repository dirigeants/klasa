import { Argument, Possible, Inhibitor } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Inhibitor {
		const inhibitor = this.client.inhibitors.get(argument);
		if (inhibitor) return inhibitor;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'inhibitor');
	}

}
