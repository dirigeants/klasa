const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'log' in client.config.consoleEvents ? !!client.config.consoleEvents.log : true });
	}

	run(data, type = 'log') {
		this.client.console.write(data, type);
	}

};
