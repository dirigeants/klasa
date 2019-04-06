const { Event } = require('klasa');

module.exports = class extends Event {

	run(err) {
		this.client.console.error(err);
		this.client.emit('discordLog', err);
	}

	init() {
		if (!this.client.options.consoleEvents.error) this.disable();
	}

};
