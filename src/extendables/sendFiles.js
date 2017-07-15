const { Extendable } = require('../index');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, 'sendFiles', ['TextChannel', 'DMChannel', 'GroupDMChannel']);
	}

	extend(files, content, options = {}) {
		return this.send(content, Object.assign(options, { files }));
	}

};
