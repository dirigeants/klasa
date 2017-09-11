const { Event } = require('klasa');

module.exports = class extends Event {

	run(warning) {
		this.client.console.warn(warning);
	}

};
