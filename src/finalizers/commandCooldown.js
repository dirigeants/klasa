const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(message) {
		if (message.author === this.client.owner) return;
		if (!message.command.cooldown || message.command.cooldown <= 0) return;

		const existing = message.command.cooldowns.get(message.author.id);
		if (existing) {
			existing.count++;
			message.command.cooldowns.set(message.author.id, existing);
			return;
		}

		message.command.cooldowns.set(message.author.id, { count: 1, time: Date.now() });
		this.client.setTimeout(() => message.command.cooldowns.delete(message.author.id), message.command.cooldown * 1000);
	}

};
