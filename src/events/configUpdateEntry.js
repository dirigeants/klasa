const { Event } = require('klasa');

module.exports = class extends Event {

	run(oldConf, newConf) {
		if (!this.client.shard) return;
		if (newConf.gateway.type === 'users') {
			this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) {
					const user = this.users.get('${newConf.id}');
					if (user) user.configs.sync();
				}
			`);
		} else if (newConf.gateway.type === 'clientStorage') {
			this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) {
					this.configs.sync();
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
