const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg, command, response) {
		if (response && response.length > 0) msg.sendMessage(response);
	}

};
