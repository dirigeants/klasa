const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'error' in client.config.consoleEvents ? !!client.config.consoleEvents.error : true });
	}

	run(err) {
		this.client.console.error(err);
	}

};
