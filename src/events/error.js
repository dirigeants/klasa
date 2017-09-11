const { Event } = require('klasa');

module.exports = class extends Event {

	run(err) {
		this.client.console.error(err);
	}

};
