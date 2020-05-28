import { Event, Message } from '@klasa/core';

import type { Command, Finalizer } from 'klasa';
import type { Stopwatch } from '@klasa/stopwatch';

export default class extends Event {

	public run(_message: Message, _command: Command, _response: Message[], _timer: Stopwatch, finalizer: Finalizer, error: Error): void {
		this.client.emit('wtf', `[FINALIZER] ${finalizer.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

}
