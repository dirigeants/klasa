const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'warn' in client.config.consoleEvents ? !!client.config.consoleEvents.warn : true });
	}

	run(warning) {
		this.client.console.warn(warning);
	}

};
