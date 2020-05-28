import { Event, Message } from '@klasa/core';

import type { Monitor } from 'klasa';

export default class extends Event {

	public run(_message: Message, monitor: Monitor, error: Error): void {
		this.client.emit('wtf', `[MONITOR] ${monitor.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

}
