const { Event } = require('klasa');

module.exports = class extends Event {

	run(err) {
		this.client.console.error(err);
	}

	init() {
		this.enabled = 'error' in this.client.config.consoleEvents ? !!this.client.config.consoleEvents.error : true;
	}

};
