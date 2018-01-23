const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	async run(msg, cmd) {
		if (msg.author === this.client.owner) return;
		if (!cmd.cooldown || cmd.cooldown <= 0) return;

		const existing = cmd.cooldowns.get(msg.author.id);

		if (!existing || existing.count < cmd.bucket) return;

		const remaining = ((cmd.cooldown * 1000) - (Date.now() - existing.time)) / 1000;

		if (remaining < 0) {
			cmd.cooldowns.delete(msg.author.id);
			return;
		}

		throw msg.language.get('INHIBITOR_COOLDOWN', Math.ceil(remaining));
	}

};
