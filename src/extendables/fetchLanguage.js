const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'Guild']);
	}

	async extend(language = null) {
		const settings = language === null ? await this.constructor.name === 'Message' ? this.fetchGuildSettings() : this.fetchSettings() : { language };
		return this.client.languages.get(settings.language || this.client.config.language);
	}

};
