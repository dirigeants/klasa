const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'wtf' in client.config.consoleEvents ? !!client.config.consoleEvents.wtf : true });
	}

	run(failure) {
		this.client.console.wtf(failure);
	}

};
