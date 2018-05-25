const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(event, args, error) {
		this.client.emit('wtf', `[EVENT] ${join(event.dir, ...event.file)}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

};
