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

		const clientStorage = this.client.gateways.get('clientStorage');
		// Added for consistency with other datastores, Client#clients does not exist
		clientStorage.cache.set(this.client.user.id, this.client);
		this.client.settings = clientStorage.create(this.client, this.client.user.id);
		await this.client.gateways.sync();

		// Init the schedule
		await this.client.schedule.init();

		// Init all the pieces
		await Promise.all(this.client.pieceStores.filter(store => !['providers', 'extendables'].includes(store.name)).map(store => store.init()));
		util.initClean(this.client);
		this.client.ready = true;

		if (this.client.options.readyMessage !== null) {
			this.client.emit('log', util.isFunction(this.client.options.readyMessage) ? this.client.options.readyMessage(this.client) : this.client.options.readyMessage);
		}

		this.client.emit('klasaReady');
	}

};
