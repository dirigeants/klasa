const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
		if (!this.client.options.consoleEvents.wtf) this.disable();
	}

	run(failure) {
		this.client.console.wtf(failure);
	}

};
