const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'messageDelete');
	}

	run(msg) {
		for (const [key, value] of this.client.commandMessages) {
			if (key === msg.id) return this.client.commandMessages.delete(key);
			if (msg.id === value.response.id) return this.client.commandMessages.delete(key);
		}
		return false;
	}

};
