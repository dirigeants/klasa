const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'mentionPrefixOnly' });
	}

	async run(message) {
		if (!message.commandText) {
			await message.sendLocale('PREFIX_REMINDER', [message.guildSettings.prefix.length ? message.guildSettings.prefix : undefined]);
		}
	}

};
