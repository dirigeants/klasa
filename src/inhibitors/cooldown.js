const { Inhibitor, Duration } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	run(message, command) {
		if (this.client.owners.has(message.author) || command.cooldown <= 0) return;

		const existing = command.cooldowns.get(message.levelID);

		if (existing && existing.limited) throw message.language.get('INHIBITOR_COOLDOWN', Duration.toNow(Date.now() + existing.remainingTime, false, true), command.cooldownLevel !== 'author');
	}

};
