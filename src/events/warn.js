const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
		if (!this.client.options.consoleEvents.warn) this.disable();
	}

	run(warning) {
		this.client.console.warn(warning);
	}

};
