const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg) {
		if (this.client.ready) this.client.monitors.run(msg);
	}

};
