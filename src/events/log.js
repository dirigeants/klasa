const { Event } = require('klasa');

module.exports = class extends Event {

	run(data, type = 'log') {
		this.client.console.write(data, type);
	}

	init() {
		this.enabled = 'debug' in this.client.config.consoleEvents.debug ? !!this.client.config.consoleEvents.debug : true;
	}

};
