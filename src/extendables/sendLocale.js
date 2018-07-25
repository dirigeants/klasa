const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: ['TextChannel', 'DMChannel', 'GroupDMChannel', 'User'] });
	}

	extend(key, args = [], options = {}) {
		if (!Array.isArray(args)) {
			options = args;
			args = [];
		}
		const language = this.guild ? this.guild.language : this.client.languages.default;
		return this.send({ content: language.get(key, ...args), ...options });
	}

};
