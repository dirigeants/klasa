const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(msg) {
		if (msg.author === this.client.owner) return;
		if (!msg.command.cooldown || msg.command.cooldown <= 0) return;

		msg.command.cooldowns.set(msg.author.id, Date.now());
		setTimeout(() => msg.command.cooldowns.delete(msg.author.id), msg.command.cooldown * 1000);
	}

};
