const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message']);
	}

	get extend() {
		if (!this.guild) return true;
		return this.readable && this.permissionsFor(this.guild.me).has('ADD_REACTIONS');
	}

};
