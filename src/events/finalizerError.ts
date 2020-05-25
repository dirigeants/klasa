import { Event } from '@klasa/core';
import type { KlasaMessage, Command, Finalizer } from 'klasa';
import type { Stopwatch } from '@klasa/stopwatch';

export default class extends Event {

	public run(_message: KlasaMessage, _command: Command, _response: KlasaMessage[], _timer: Stopwatch, finalizer: Finalizer, error: Error): void {
		this.client.emit('wtf', `[FINALIZER] ${finalizer.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

}
