const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, 'guildCreate');
	}

	run(guild) {
		if (guild.available) this.client.settingGateway.create(guild).catch(err => this.client.emit('log', err, 'error'));
	}

};
