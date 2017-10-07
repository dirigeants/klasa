const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'Guild']);
	}

	async extend(...parameters) {
		const language = await this.fetchLanguage();
		return language.get(...parameters);
	}

};
