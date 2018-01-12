const { Event } = require('klasa');

module.exports = class extends Event {

	run(warning) {
		this.client.console.debug(warning);
	}

	init() {
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

};
