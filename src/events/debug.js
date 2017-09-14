const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'debug' in client.config.consoleEvents ? !!client.config.consoleEvents.debug : false });
	}

	run(warning) {
		this.client.console.debug(warning);
	}

};
