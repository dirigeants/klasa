const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(message) {
		if (message.author === this.client.owner) return;
		if (message.command.cooldown <= 0) return;

		const id = message.levelID;
		const rateLimit = message.command.cooldowns.get(id) || message.command.cooldowns.create(id);

		try {
			rateLimit.drip();
		} catch (err) {
			this.client.console.emit('error', `${message.author.username}[${message.author.id}] has exceeded the RateLimit for ${message.command}`);
		}
	}

};
