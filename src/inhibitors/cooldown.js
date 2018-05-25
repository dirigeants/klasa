const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	async run(message, command) {
		if (message.author === this.client.owner) return;
		if (!command.cooldown || command.cooldown <= 0) return;

		const existing = command.cooldowns.get(message.author.id);

		if (!existing || existing.count < command.bucket) return;

		const remaining = ((command.cooldown * 1000) - (Date.now() - existing.time)) / 1000;

		if (remaining < 0) {
			command.cooldowns.delete(message.author.id);
			return;
		}

		throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(remaining));
	}

};
