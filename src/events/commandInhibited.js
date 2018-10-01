const { Event } = require('klasa');

module.exports = class extends Event {

	run(message, response) {
		if (response && response.length) message.sendMessage(response);
	}

};
