const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(lang, content, options = {}) {
		return this.send({ ...options, content, code: lang });
	}

};
