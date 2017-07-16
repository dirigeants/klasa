const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'messageBulkDelete');
	}

	run(msgs) {
		for (const msg of msgs.values()) this.client.emit('messageDelete', msg); // eslint-disable-line no-restricted-syntax
	}

};
