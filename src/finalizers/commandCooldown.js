const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(msg) {
		if (msg.author === this.client.owner) return;
		if (!msg.command.cooldown || msg.command.cooldown <= 0) return;

		const existing = msg.command.cooldowns.get(msg.author.id);
		if (existing) {
			existing.count++;
			msg.command.cooldowns.set(msg.author.id, existing);
			return;
		}

		msg.command.cooldowns.set(msg.author.id, { count: 1, time: Date.now() });
		this.client.setTimeout(() => msg.command.cooldowns.delete(msg.author.id), msg.command.cooldown * 1000);
	}

};
