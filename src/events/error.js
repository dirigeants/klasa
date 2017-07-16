const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'error');
	}

	run(err) {
		this.client.emit('log', err, 'error');
	}

};
