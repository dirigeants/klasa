const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available) this.client.settings.guilds.create(guild).catch(err => this.client.emit('error', err));
	}

};
