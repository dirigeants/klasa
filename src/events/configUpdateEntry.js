const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	run(configs) {
		if (this.client.shard && gateways.includes(configs.gateway.type)) {
			this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) {
					const entry = this.gateways.${configs.gateway.type}.cache.get('${configs.id}');
					if (entry) entry._patch(${JSON.stringify(configs)});
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
