const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'settingsDelete' });
	}

	run(settings) {
		if (gateways.includes(settings.gateway.name)) {
			this.client.shard.broadcastEval(`
				if (String(this.shard.id) !== '${this.client.shard.id}') {
					const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
					if (entry && entry.existenceStatus) {
						this.emit('settingsDelete', entry);
						entry.init(entry, entry.schema);
						entry.existenceStatus = false;
					}
				}
			`);
		}
	}

	init() {
		if (!this.client.shard) this.disable();
	}

};
