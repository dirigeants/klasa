const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg) {
		if (msg.author === this.client.owner) return;
		if (this.client.configs.userBlacklist.includes(msg.author.id)) throw true;
	}

};
