const { Extendable } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['GroupDMChannel', 'DMChannel', 'TextChannel'] });
	}

	get extend() {
		return !this.guild || (this.postable && this.permissionsFor(this.guild.me).has(FLAGS.EMBED_LINKS));
	}

};
