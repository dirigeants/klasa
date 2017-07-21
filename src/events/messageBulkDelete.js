const { Event } = require('klasa');

module.exports = class extends Event {

	run(msgs) {
		for (const msg of msgs.values()) this.client.emit('messageDelete', msg); // eslint-disable-line no-restricted-syntax
	}

};
