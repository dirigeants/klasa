const { Event } = require('klasa');

module.exports = class extends Event {

	run(log) {
		this.client.console.verbose(log);
	}

	init() {
		this.enabled = 'debug' in this.client.config.consoleEvents.debug ? !!this.client.config.consoleEvents.debug : true;
	}

};
