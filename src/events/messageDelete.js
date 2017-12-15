const { Event } = require('klasa');

module.exports = class extends Event {

	run(message) {
		if (message.command && message.command.deletable && message.responses) {
			if (Array.isArray(message.responses)) for (const msg of message.responses) msg.delete();
			else message.responses.delete();
		}
	}

};
