const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg, command, params, error) {
		if (error) this.client.emit('wtf', error.stack ? error.stack : error);
	}

};
