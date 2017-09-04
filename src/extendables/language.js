const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'Guild']);
	}

	get extend() {
		return this.client.languages.get((this.constructor.name === 'Message' ? this.guildSettings.language : this.settings.language) || this.client.config.language);
	}

};
