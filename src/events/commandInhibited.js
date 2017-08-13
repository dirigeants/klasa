const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg, command, response) {
		if (response) msg.reply(response);
	}

};
