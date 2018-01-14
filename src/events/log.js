const { Event } = require('klasa');

module.exports = class extends Event {

	run(data, type = 'log') {
		this.client.console.write(data, type);
	}

	init() {
		if (!this.client.options.consoleEvents.log) this.disable();
	}

};
