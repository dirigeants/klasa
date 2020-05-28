import { Argument, Possible, Task } from 'klasa';

import type { Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: Message): Task {
		const task = this.client.tasks.get(argument);
		if (task) return task;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'task');
	}

}
