const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (!guild.available) return;
		if (this.client.configs.guildBlacklist.includes(guild.id)) {
			guild.leave();
			this.client.emit('warn', `Blacklisted guild detected: ${guild.name} [${guild.id}]`);
		}
	}

};
