const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'verbose' in client.config.consoleEvents ? !!client.config.consoleEvents.verbose : false });
	}

	run(log) {
		this.client.console.verbose(log);
	}

};
