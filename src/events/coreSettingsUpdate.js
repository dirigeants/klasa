const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
			event: 'settingsUpdate'
		});
	}

	run(settings) {
		if (this.client.shard && gateways.includes(settings.gateway.name)) {
			this.client.shard.broadcastEval(`
				if (this.shard.id !== ${this.client.shard.id}) {
					const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
					if (entry) {
						entry._patch(${JSON.stringify(settings)});
						entry.existenceStatus = true;
						this.emit('settingsSync', settings);
					}
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
