const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(scheduledTask, task, error) {
		this.client.emit('wtf', `[TASK] ${join(task.dir, ...task.file)}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

};
