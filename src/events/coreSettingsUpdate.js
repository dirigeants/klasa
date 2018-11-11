const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'settingsUpdate' });
	}

	run(settings) {
		if (gateways.includes(settings.gateway.name)) {
			this.client.shard.broadcastEval(`
				if (String(this.shard.id) !== '${this.client.shard.id}') {
					const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
					if (entry) {
						entry._patch(${JSON.stringify(settings)});
						entry.existenceStatus = true;
						this.emit('settingsSync', entry);
					}
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
