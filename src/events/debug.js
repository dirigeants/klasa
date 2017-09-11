const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { enabled: false });
	}

	run(warning) {
		this.client.console.debug(warning);
	}

};
