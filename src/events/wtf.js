const { Event } = require('klasa');

module.exports = class extends Event {

	run(failure) {
		this.client.console.wtf(failure);
	}

	init() {
		this.enabled = 'wtf' in this.client.config.consoleEvents ? !!this.client.config.consoleEvents.wtf : true;
	}

};
