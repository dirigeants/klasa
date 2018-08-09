const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available && !this.client.settings.preserveSettings) guild.settings.destroy().catch(() => null);
	}

};
