const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args);
		if (!this.client.options.consoleEvents.error) this.disable();
	}

	run(error) {
		this.client.console.error(error);
	}

};
