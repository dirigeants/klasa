const { Event } = require('klasa');

module.exports = class extends Event {

	run(configs) {
		if (!this.client.shard) return;
		if (configs.gateway.type === 'users') {
			this.client.shard.broadcastEval(client => {
				if (client.shard.id === this.client.shard.id) return;
				const user = client.users.get(configs.id);
				if (user) user.configs.sync();
			});
		} else if (configs.gateway.type === 'clientStorage') {
			this.client.shard.broadcastEval(client => {
				if (client.shard.id === this.client.shard.id) return;
				client.configs.sync();
			});
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
