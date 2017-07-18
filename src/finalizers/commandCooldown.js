const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, 'commandCooldown');
	}

	run(msg) {
		if (msg.author.id === this.client.config.ownerID) return;
		if (!msg.cmd.cooldown || msg.cmd.cooldown <= 0) return;

		msg.cmd.cooldowns.set(msg.author.id, Date.now());
		setTimeout(() => msg.cmd.cooldowns.delete(msg.author.id), msg.cmd.cooldown * 1000);
	}

};
