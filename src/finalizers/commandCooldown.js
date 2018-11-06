const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(message, command) {
		if (command.cooldown <= 0 || message.author === this.client.owner) return;

		try {
			command.cooldowns.acquire(message.levelID).drip();
		} catch (err) {
			this.client.emit('error', `${message.author.username}[${message.author.id}] has exceeded the RateLimit for ${message.command}`);
		}
	}

};
