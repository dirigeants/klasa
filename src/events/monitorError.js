const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(msg, monitor, error) {
		this.client.emit('wtf', `[MONITOR] ${join(monitor.dir, ...monitor.file)}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
	}

};
