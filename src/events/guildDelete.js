const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available && !this.client.configs.preserveConfigs) guild.configs.destroy().catch(() => null);
	}

};
