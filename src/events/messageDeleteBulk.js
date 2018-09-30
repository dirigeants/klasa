const { Event } = require('klasa');

module.exports = class extends Event {

	run(messages) {
		for (const message of messages) {
			if (message.command && message.command.deletable) {
				for (const msg of message.responses) {
					if (!msg.deleted) msg.delete();
				}
			}
		}
	}

};
