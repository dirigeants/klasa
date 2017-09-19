const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(files, content, options = {}) {
		return this.send(content, Object.assign(options, { files }));
	}

};
