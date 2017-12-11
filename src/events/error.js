const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: client.options.consoleEvents.error });
	}

	run(err) {
		this.client.console.error(err);
	}

};
