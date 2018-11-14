const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

	run(data) {
		this.client.console.debug(data);
	}

};
