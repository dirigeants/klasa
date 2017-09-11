const { Event } = require('klasa');

module.exports = class extends Event {

	run(log) {
		this.client.console.verbose(log);
	}

};
