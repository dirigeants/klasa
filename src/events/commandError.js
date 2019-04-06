const { Event } = require('klasa');

module.exports = class extends Event {

	run(message, command, params, error) {
		if (error instanceof Error) {
			const errorMessage = `[COMMAND] ${command.path}\n${error.stack || error}`;
			this.client.emit('wtf', errorMessage);
			this.client.emit('discordLog', errorMessage);
		}
		if (error.message) message.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		else message.sendMessage(error).catch(err => this.client.emit('wtf', err));
	}

};
