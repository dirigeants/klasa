const { Event, util } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true,
			event: 'ready'
		});
	}

	async run() {
		await this.client.gateways._ready();
		if (this.client.user.bot) this.client.application = await this.client.fetchApplication();
		if (!this.client.options.ownerID) this.client.options.ownerID = this.client.user.bot ? this.client.application.owner.id : this.client.user.id;

		// Client-wide settings
		this.client.configs = this.gateways.clientStorage.cache.get(this.user.id) || this.gateways.clientStorage.insertEntry(this.user.id);
		await this.configs.sync();

		// Init all the pieces
		await Promise.all(this.client.pieceStores.filter(store => !['providers', 'extendables'].includes(store.name)).map(store => store.init()));
		util.initClean(this.client);
		this.client.ready = true;

		// Init the schedule
		await this.client.schedule.init();

		if (typeof this.client.options.readyMessage === 'undefined') {
			this.client.emit('log', `Successfully initialized. Ready to serve ${this.client.guilds.size} guilds.`);
		} else if (this.client.options.readyMessage !== null) {
			this.client.emit('log', util.isFunction(this.client.options.readyMessage) ? this.client.options.readyMessage(this.client) : this.client.options.readyMessage);
		}

		this.client.emit('klasaReady');
	}

};
