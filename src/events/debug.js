const { Event } = require('klasa');

module.exports = class extends Event {

	run(warning) {
		this.client.console.debug(warning);
	}

	init() {
		this.enabled = 'debug' in this.client.config.consoleEvents ? !!this.client.config.consoleEvents.debug : false;
	}

};
