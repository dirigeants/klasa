const { Event } = require('klasa');

module.exports = class extends Event {

	run(failure) {
		this.client.console.wtf(failure);
	}

	init() {
		this.enabled = 'debug' in this.client.config.consoleEvents.debug ? !!this.client.config.consoleEvents.debug : true;
	}

};
