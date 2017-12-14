const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: client.options.consoleEvents.wtf });
	}

	run(failure) {
		this.client.console.wtf(failure);
	}

};
