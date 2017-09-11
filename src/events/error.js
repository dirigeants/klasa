const { Event } = require('klasa');

module.exports = class extends Event {

	run(err) {
		this.client.console.error(err);
	}

	init() {
		this.enabled = 'debug' in this.client.config.consoleEvents.debug ? !!this.client.config.consoleEvents.debug : true;
	}

};
