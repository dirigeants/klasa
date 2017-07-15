const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'readable', ['GroupDMChannel', 'DMChannel', 'TextChannel']);
	}

	get extend() {
		if (!this.guild) return true;
		return this.permissionsFor(this.guild.me).has('READ_MESSAGES');
	}

};
