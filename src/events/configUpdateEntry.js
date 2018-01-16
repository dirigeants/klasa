const { Event } = require('klasa');

module.exports = class extends Event {

	run(configs) {
		if (!this.client.shard) return;
		if (configs.type === 'users') {
			this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) {
					const user = this.users.get('${configs.id}');
					if (user) user.configs.sync();
				}
			`);
		} else if (configs.type === 'clientStorage') {
			this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) {
					this.configs.sync();
				}
			`);
		}
	}

};
