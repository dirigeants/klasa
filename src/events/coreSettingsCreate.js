const { Event } = require('klasa');
const gateways = ['users', 'clientStorage'];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'settingsCreate' });
	}

	run(settings, updateObject) {
		if (gateways.includes(settings.gateway.name) && this.client.ready) {
			this.client.shard.broadcastEval(`
				if (String(this.options.shards) !== '${this.client.options.shards}') {
					const entry = this.gateways.get('${settings.gateway.name}').get('${settings.id}');
					if (entry) {
						entry._patch(${JSON.stringify(updateObject)});
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
