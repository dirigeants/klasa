const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['GroupDMChannel', 'DMChannel', 'TextChannel']);
	}

	get extend() {
		if (!this.guild) return true;
		return this.readable && this.permissionsFor(this.guild.me).has('SEND_MESSAGES');
	}

};
