const { Finalizer } = require('../index');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, 'commandCooldown', {});
	}

	run(msg) {
		if (msg.author.id === this.client.config.ownerID) return;
		if (!msg.cmd.conf.cooldown || msg.cmd.conf.cooldown <= 0) return;

		msg.cmd.cooldown.set(msg.author.id, Date.now());
		setTimeout(() => msg.cmd.cooldown.delete(msg.author.id), msg.cmd.conf.cooldown * 1000);
	}

};
