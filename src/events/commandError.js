const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg, command, params, error) {
		if (error.stack) this.client.emit('wtf', error.stack);
		else if (error.message) msg.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		else msg.sendMessage(error).catch(err => this.client.emit('wtf', err));
	}

};
