const { Event } = require('klasa');

module.exports = class extends Event {

	run(configs) {
		if (this.client.sharded && configs.type === 'users') {
			this.client.shard.broadcastEval(`
				const user = this.users.get(${configs.id});
				if (user) user.configs.sync();
			`);
		}
	}

};
