const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'guildDelete' });
	}

	run(guild) {
		if (this.client.ready && guild.available && !this.client.options.settings.preserve) guild.settings.destroy().catch(() => null);
	}

};
