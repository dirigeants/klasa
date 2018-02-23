const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User'] });
	}

	extend(lang, content, options = {}) {
		return this.sendMessage(content, { ...options, code: lang });
	}

};
