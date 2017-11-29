const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available && !this.client.configs.preserveConfigs) this.client.gateways.guilds.deleteEntry(guild.id).catch(() => null);
	}

};
