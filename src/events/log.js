const { Event } = require('klasa');

module.exports = class extends Event {

	run(data, type = 'log') {
		this.client.console.write(data, type);
	}

};
