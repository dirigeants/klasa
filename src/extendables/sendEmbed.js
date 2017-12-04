const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User']);
	}

	extend(embed, content, options) {
		if (!options && typeof content === 'object') {
			options = content;
			content = '';
		} else if (!options) {
			options = {};
		}
		return this.sendMessage(content, Object.assign(options, { embed }));
	}

};
