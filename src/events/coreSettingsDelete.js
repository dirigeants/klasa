const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'settingsDelete' });
		this.enabled = Boolean(this.client.shard);
	}

	run(settings) {
		if (gateways.includes(settings.gateway.name)) {
			this.client.shard.broadcastEval(`
				if (String(this.options.shards) !== '${this.client.options.shards}') {
					const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
					if (entry && entry.existenceStatus) {
						entry.init(entry, entry.schema);
						entry.existenceStatus = false;
						this.emit('settingsSync', entry);
					}
				}
			`);
		}
	}

};
