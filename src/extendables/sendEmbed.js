const { APIMessage } = require('discord.js');
const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User'] });
	}

	extend(embed, content, options = {}) {
		return this.send(APIMessage.transformOptions(content, options, { embed }));
	}

};
