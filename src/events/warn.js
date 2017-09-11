const { Event } = require('klasa');

module.exports = class extends Event {

	run(warning) {
		this.client.console.warn(warning);
	}

	init() {
		this.enabled = 'warn' in this.client.config.consoleEvents ? !!this.client.config.consoleEvents.warn : true;
	}

};
