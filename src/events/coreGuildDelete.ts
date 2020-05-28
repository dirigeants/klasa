import { Event, EventStore, Guild } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'guildDelete' });
	}

	public async run(guild: Guild): Promise<void> {
		if (!guild.unavailable && !this.client.options.settings.preserve) await guild.settings.destroy();
	}

}
