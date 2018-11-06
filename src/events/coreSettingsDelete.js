const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'settingsDelete' });
	}

	run(settings) {
		if (gateways.includes(settings.gateway.name)) {
			this.client.shard.broadcastEval(`
				if (Array.isArray(this.shard.id) ? this.shard.id.includes(${this.client.shard.id}) : this.shard.id === ${this.client.shard.id}) return;
				const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
				if (entry && entry.existenceStatus) {
					this.emit('settingsDelete', settings);
					entry.init(entry, entry.schema);
					entry.existenceStatus = false;
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
