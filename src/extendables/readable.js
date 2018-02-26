const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['GroupDMChannel', 'DMChannel', 'TextChannel'] });
	}

	get extend() {
		return !this.guild || this.permissionsFor(this.guild.me).has('VIEW_CHANNEL');
	}

};
