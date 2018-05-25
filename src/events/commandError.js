const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(message, command, params, error) {
		if (error instanceof Error) this.client.emit('wtf', `[COMMAND] ${join(command.dir, ...command.file)}\n${error.stack || error}`);
		if (error.message) message.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		else message.sendMessage(error).catch(err => this.client.emit('wtf', err));
	}

};
