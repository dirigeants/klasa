const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: client.options.consoleEvents.verbose });
	}

	run(log) {
		this.client.console.verbose(log);
	}

};
