const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message']);
	}

	get extend() {
		return this.guild ? this.guild.settings : this.client.settings.guilds.defaults;
	}

};
