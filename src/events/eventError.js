const { Event } = require('klasa');

module.exports = class extends Event {

	run(event, args, error) {
		const errorMessage = `[EVENT] ${event.path}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`;
		this.client.emit('wtf', errorMessage);
		this.client.emit('discordLog', errorMessage);
	}

};
