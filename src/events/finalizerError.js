const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(message, response, timer, finalizer, error) {
		this.client.emit('wtf', `[FINALIZER] ${join(finalizer.dir, ...finalizer.file)}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

};
