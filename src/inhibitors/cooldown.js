const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	async run(message, command) {
		if (message.author === this.client.owner) return;
		if (command.cooldown <= 0) return;

		const level = command.cooldownLevel === 'guild' && message.channel.type === 'dm' ? 'channel' : command.cooldownLevel;
		const { id } = message[level];
		const existing = command.cooldowns.get(id);

		try {
			if (existing) existing.drip();
			else message.command.cooldowns.create(id).drip();
		} catch (err) {
			throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(existing.reset / 1000));
		}
	}

};
