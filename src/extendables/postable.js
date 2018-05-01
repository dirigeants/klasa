const { Extendable } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['GroupDMChannel', 'DMChannel', 'TextChannel'] });
	}

	get extend() {
		return !this.guild || this.permissionsFor(this.guild.me).has([FLAGS.VIEW_CHANNEL, FLAGS.SEND_MESSAGES]);
	}

};
