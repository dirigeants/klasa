const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'sendCode', ['Message', 'TextChannel', 'DMChannel', 'GroupDMChannel']);
	}

	extend(lang, content, options = {}) {
		return this.sendMessage(content, Object.assign(options, { code: lang }));
	}

};
