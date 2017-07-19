const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'message');
	}

	run(msg) {
		if (this.client.ready) this.client.monitors.run(msg);
	}

};
