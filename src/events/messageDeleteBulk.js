const { Event } = require('klasa');

module.exports = class extends Event {

	run(messages) {
		for (const message of messages.values()) {
			if (message.command && message.command.deletable) {
				for (const msg of message.responses.values()) {
					if (!msg.deleted) msg.delete();
				}
			}
		}
	}

};
