const { Event } = require('klasa');

module.exports = class extends Event {

	run(scheduledTask, task, error) {
		const errorMessage = `[TASK] ${task.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`;
		this.client.emit('wtf', errorMessage);
		this.client.emit('discordLog', errorMessage);
	}

};
