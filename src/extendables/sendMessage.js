const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(content, options) {
		return this.send(content, options);
	}

};
