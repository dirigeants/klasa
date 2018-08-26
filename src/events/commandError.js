const { Event } = require('klasa');

module.exports = class extends Event {

	run(message, command, params, error) {
		if (command.cooldown !== 0) {
			const level = command.cooldownLevel === 'guild' && message.channel.type === 'dm' ? 'channel' : command.cooldownLevel;
			const existing = command.cooldowns.get(message[level].id);
			if (existing) existing.undrip();
		}
		if (error instanceof Error) this.client.emit('wtf', `[COMMAND] ${command.path}\n${error.stack || error}`);
		if (error.message) message.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		else message.sendMessage(error).catch(err => this.client.emit('wtf', err));
	}

};
