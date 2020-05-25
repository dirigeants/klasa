import { Event, EventStore, ClientUser } from '@klasa/core';
import { isFunction } from '@klasa/utils';
import type { Gateway } from 'klasa';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, {
			once: true,
			event: 'ready'
		});
	}

	public async run(): Promise<void> {
		const clientUser = this.client.user as ClientUser;
		this.client.mentionPrefix = new RegExp(`^<@!?${clientUser.id}>`);

		const clientStorage = this.client.gateways.get('clientStorage') as Gateway;
		this.client.settings = clientStorage.acquire(clientUser);
		this.client.settings.sync();

		// Init all the pieces
		await Promise.all(this.client.pieceStores.filter(store => !['providers', 'extendables'].includes(store.name)).map(store => store.init()));
		this.client.ready = true;

		// Init the schedule
		await this.client.schedule.init();

		if (this.client.options.readyMessage !== null) {
			this.client.emit('log', isFunction(this.client.options.readyMessage) ? this.client.options.readyMessage(this.client) : this.client.options.readyMessage);
		}

		this.client.emit('klasaReady');
		return undefined;
	}

}
