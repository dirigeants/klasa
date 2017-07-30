const { Event } = require('klasa');

module.exports = class extends Event {

	run(guild) {
		if (guild.available) this.client.settingGateway.create(guild).catch(err => this.client.emit('log', err, 'error'));
	}

};
