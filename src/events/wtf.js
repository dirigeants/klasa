const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { enabled: false });
	}

	run(failure) {
		this.client.emit('log', failure, 'wtf');
	}

};
