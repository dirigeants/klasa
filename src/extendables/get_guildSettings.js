const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'guildSettings', ['Message']);
	}

	get extend() {
		return this.guild ? this.guild.settings : this.client.settingGateway.defaults;
	}

};
