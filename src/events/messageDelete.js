const { Event } = require('klasa');

module.exports = class extends Event {

	run(message) {
		if (message.command && message.command.deletable && message.responses) {
			if (Array.isArray(this.responses)) for (const msg of this.responses) msg.delete();
			else this.responses.delete();
		}
	}

};
