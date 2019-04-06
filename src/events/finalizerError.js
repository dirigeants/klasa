const { Event } = require('klasa');

module.exports = class extends Event {

	run(message, command, response, timer, finalizer, error) {
		const errorMessage = `[FINALIZER] ${finalizer.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`;
		this.client.emit('wtf', errorMessage);
		this.client.emit('discordLog', errorMessage);
	}

};
