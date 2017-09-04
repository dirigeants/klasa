const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['Message', 'TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(lang, content, options = {}) {
		return this.sendMessage(content, Object.assign(options, { code: lang }));
	}

};
