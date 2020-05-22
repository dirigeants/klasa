import { Event } from '@klasa/core';

export default class extends Event {

	constructor(...args) {
		super(...args, { event: 'guildDelete' });
	}

	run(guild) {
		if (this.client.ready && guild.available && !this.client.options.preserveSettings) guild.settings.destroy().catch(() => null);
	}

}
