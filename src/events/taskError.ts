import { Event } from '@klasa/core';

import type { Task, ScheduledTask } from 'klasa';

export default class extends Event {

	public run(_scheduledTask: ScheduledTask, task: Task, error: Error): void {
		this.client.emit('wtf', `[TASK] ${task.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

}
