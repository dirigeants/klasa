const { Event } = require('klasa');

module.exports = class extends Event {

	run(warning) {
		this.client.console.warn(warning);
	}

	init() {
		this.enabled = 'debug' in this.client.config.consoleEvents.debug ? !!this.client.config.consoleEvents.debug : true;
	}

};
