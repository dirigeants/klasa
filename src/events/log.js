const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: client.options.consoleEvents.log });
	}

	run(data, type = 'log') {
		this.client.console.write(data, type);
	}

};
