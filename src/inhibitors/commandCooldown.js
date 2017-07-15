const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, 'cooldown', { spamProtection: true });
	}

	async run(msg, cmd) {
		if (msg.author.id === this.client.config.ownerID) return;
		if (!cmd.conf.cooldown || cmd.conf.cooldown <= 0) return;

		const instance = cmd.cooldown.get(msg.author.id);

		if (!instance) return;

		const remaining = ((cmd.conf.cooldown * 1000) - (Date.now() - instance)) / 1000;

		if (remaining < 0) {
			cmd.cooldown.delete(msg.author.id);
			return;
		}

		throw `You have just used this command. You can use this command again in ${Math.ceil(remaining)} seconds.`;
	}

};
