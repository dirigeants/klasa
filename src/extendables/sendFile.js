const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User'] });
	}

	extend(attachment, name, content, options = {}) {
		return this.send({ ...options, files: [{ attachment, name }], content });
	}

};
