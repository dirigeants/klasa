const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(message, command) {
		if (command.cooldown <= 0 || this.client.owners.has(message.author)) return;

		try {
			command.cooldowns.acquire(message.guild ? message[command.cooldownLevel].id : message.author.id).drip();
		} catch (err) {
			this.client.emit('error', `${message.author.username}[${message.author.id}] has exceeded the RateLimit for ${message.command}`);
		}
	}

};
