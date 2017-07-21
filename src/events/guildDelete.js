const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available) this.client.settingGateway.destroy(guild.id).catch(() => null);
	}

};
