const { Event } = require('klasa');
const { join } = require('path');

module.exports = class extends Event {

	run(msg, command, params, error) {
		if (error instanceof Error) this.client.emit('wtf', `[COMMAND] ${join(command.dir, ...command.file)}\n${error.stack || error}`);
		if (error.message) msg.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		else msg.sendMessage(error).catch(err => this.client.emit('wtf', err));
	}

};
