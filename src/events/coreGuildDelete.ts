import { Event, EventStore, Guild } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'guildDelete' });
	}

	public run(guild: Guild): void {
		if (!guild.unavailable && !this.client.options.settings.preserve) guild.settings.destroy().catch(() => null);
	}

}
