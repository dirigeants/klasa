const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User'] });
	}

	extend(embed, content, options = {}) {
		if (typeof content === 'object') {
			options = content;
			content = '';
		}
		return this.send({ content, ...options, embed });
	}

};
