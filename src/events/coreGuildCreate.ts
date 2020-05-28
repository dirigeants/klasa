import { Event, EventStore, Guild } from '@klasa/core';

export default class extends Event {

	public constructor(store: EventStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { event: 'guildCreate' });
	}

	public async run(guild: Guild): Promise<void> {
		if (guild.unavailable) return;

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if ((this.client.settings!.get('guildBlacklist') as string[]).includes(guild.id)) {
			await guild.leave();
			this.client.emit('warn', `Blacklisted guild detected: ${guild.name} [${guild.id}]`);
		}
	}

}
