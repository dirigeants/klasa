const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(msg) {
		if (msg.author.id === this.client.options.ownerID) return;
		if (this.client.configs.userBlacklist.includes(msg.author.id)) throw true;
	}

};
