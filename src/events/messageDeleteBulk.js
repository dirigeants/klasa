const { Event } = require('klasa');

module.exports = class extends Event {

	run(messages) {
		for (const msg of messages) this.client.emit('messageDelete', msg);
	}

};
