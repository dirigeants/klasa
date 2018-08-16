const { Event, util } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
			event: 'ready'
		});
	}

	async run() {
		await this.client.fetchApplication();
		if (!this.client.options.ownerID) this.client.options.ownerID = this.client.application.owner.id;

		this.client.settings = this.client.gateways.clientStorage.get(this.client.user.id, true);
		// Added for consistency with other datastores, Client#clients does not exist
		this.client.gateways.clientStorage.cache.set(this.client.user.id, this.client);
		await this.client.gateways.sync();

		// Init all the pieces
		await Promise.all(this.client.pieceStores.filter(store => !['providers', 'extendables'].includes(store.name)).map(store => store.init()));
		util.initClean(this.client);
		this.client.ready = true;

		// Init the schedule
		await this.client.schedule.init();

		if (this.client.options.readyMessage !== null) {
			this.client.emit('log', util.isFunction(this.client.options.readyMessage) ? this.client.options.readyMessage(this.client) : this.client.options.readyMessage);
		}

		this.client.emit('klasaReady');
	}

};
