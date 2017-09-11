const { Event } = require('klasa');

module.exports = class extends Event {

	run(data, type = 'log') {
		this.client.console.write(data, type);
	}

	init() {
		this.enabled = 'log' in this.client.config.consoleEvents ? !!this.client.config.consoleEvents.log : true;
	}

};
