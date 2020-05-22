import { Event } from 'klasa';

export class extends Event {

	run(scheduledTask, task, error) {
		this.client.emit('wtf', `[TASK] ${task.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

};
