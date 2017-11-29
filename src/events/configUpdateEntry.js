const { Event } = require('klasa');

module.exports = class extends Event {

	run(settings) {
		if (this.client.options.sharded && settings.type === 'users') {
			this.client.shard.broadcastEval(`
				const user = this.users.get(${settings.id});
				if (user) user.configs.sync();
			`);
		}
	}

};
