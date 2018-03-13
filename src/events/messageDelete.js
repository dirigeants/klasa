const { Event } = require('klasa');

module.exports = class extends Event {

	run(message) {
		if (message.command && message.command.deletable && message.responses.length) {
			for (const msg of message.responses) msg.delete();
		}
	}

};
