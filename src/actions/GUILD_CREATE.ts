import { Action, extender, Guild } from '@klasa/core';

import type { GuildCreateDispatch } from '@klasa/ws';

export default class CoreAction extends Action {

	public async run(data: GuildCreateDispatch): Promise<void> {
		const built = this.build(data);
		if (built) {
			await built.settings.sync();
			this.cache(built);
			this.client.emit(this.clientEvent, built);
		}
	}

	public check(): null {
		return null;
	}

	public build(data: GuildCreateDispatch): Guild {
		// eslint-disable-next-line camelcase
		return new (extender.get('Guild'))(this.client, data.d, data.shard_id);
	}

	public cache(data: Guild): void {
		if (this.client.options.cache.enabled) {
			this.client.guilds.set(data.id, data);
		}
	}

}
