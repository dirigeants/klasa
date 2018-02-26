const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User'] });
	}

	extend(files, content, options = {}) {
		return this.send(content, { ...options, files });
	}

};
