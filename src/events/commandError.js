const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg, command, params, error) {
		if (error.stack) this.client.emit('error', error.stack);
		else if (error.message) msg.sendCode('JSON', error.message).catch(err => this.client.emit('error', err));
		else msg.sendMessage(error).catch(err => this.client.emit('error', err));
	}

};
