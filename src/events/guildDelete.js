const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available) this.client.settings.guilds.destroy(guild.id).catch(() => null);
	}

};
