const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(msg, command, params, error) {
		this.client.emit('wtf', `[COMMAND] ${join(command.dir, ...command.file)}\n${error ?
			error.stack ? error.stack : error : 'Unknown error'}`);
		if (error.message) msg.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		else msg.sendMessage(error).catch(err => this.client.emit('wtf', err));
	}

};
