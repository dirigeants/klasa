const { Inhibitor } = require('klasa');
const ms = require("ms")

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	run(message, command) {
		if (message.author === this.client.owner || command.cooldown <= 0) return;

		const existing = command.cooldowns.get(message.levelID);

		if (existing && existing.limited) throw message.language.get('INHIBITOR_COOLDOWN', ms(existing.remainingTime));
	}

};
