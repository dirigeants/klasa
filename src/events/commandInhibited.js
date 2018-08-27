const { Event } = require('klasa');

module.exports = class extends Event {

	run(message, command, response) {
		if (command.cooldown !== 0) {
			const existing = command.cooldowns.get(message.levelID);
			if (existing) existing.undrip();
		}
		if (response && response.length) message.sendMessage(response);
	}

};
