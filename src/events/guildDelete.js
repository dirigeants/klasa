const { Event } = require('../index');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'guildDelete');
	}

	run(guild) {
		if (guild.available) this.client.settingGateway.destroy(guild.id).catch(() => null);
	}

};
