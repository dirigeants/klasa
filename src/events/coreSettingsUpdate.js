const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'settingsUpdate' });
	}

	run(settings) {
		if (gateways.includes(settings.gateway.name)) {
			this.client.shard.broadcastEval(`
				if (Array.isArray(this.shard.id) ? this.shard.id.includes(${this.client.shard.id}) : this.shard.id === ${this.client.shard.id}) return;
				const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
				if (entry) {
					entry._patch(${JSON.stringify(settings)});
					entry.existenceStatus = true;
					this.emit('settingsSync', settings);
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
