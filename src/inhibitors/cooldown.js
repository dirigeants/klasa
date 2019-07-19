const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: true });
	}

	run(message, command) {
		if (this.client.owners.has(message.author) || command.cooldown <= 0) return;

		const existing = command.cooldowns.get(message.levelID);

		if (existing && existing.limited) throw message.language.get('INHIBITOR_COOLDOWN', this.secondsToFormattedString(Math.ceil(existing.remainingTime / 1000)), command.cooldownLevel !== 'author');
	}
	
	secondsToFormattedString(seconds) {
		const days = Math.floor(duration / 86400);
		const hours = Math.floor(duration / 3600);
		const minutes = Math.floor(duration / 60);
		const seconds = Math.floor(duration % 60);
		return `${days ? `${days}d ` : ''}${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds ? `${seconds}s ` : ''}`;
	}

};
