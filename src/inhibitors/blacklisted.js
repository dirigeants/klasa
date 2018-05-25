const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message) {
		if (message.author === this.client.owner) return;
		if (this.client.configs.userBlacklist.includes(message.author.id)) throw true;
	}

};
