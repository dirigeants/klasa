const { Event } = require('klasa');

module.exports = class extends Event {

	run(log) {
		this.client.console.verbose(log);
	}

	init() {
		this.enabled = 'verbose' in this.client.config.consoleEvents ? !!this.client.config.consoleEvents.verbose : true;
	}

};
