const { Event } = require('klasa');

module.exports = class extends Event {

	run(warning) {
		this.client.emit('log', warning, 'warn');
	}

};
