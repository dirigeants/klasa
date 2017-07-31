const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'Guild']);
	}

	get extend() {
		return this.client.languages.get(this.guild ? this.guildSettings.language : this.settings.language);
	}

};
