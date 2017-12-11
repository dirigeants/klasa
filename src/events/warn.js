const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: client.options.consoleEvents.warn });
	}

	run(warning) {
		this.client.console.warn(warning);
	}

};
