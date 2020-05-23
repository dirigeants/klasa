import { extender } from '@klasa/core';

import type { Settings } from '../settings/Settings';
import type { Language } from '../structures/Language';
import { KlasaClient } from '../Client';

/**
 * Klasa's Extended Guild
 * @extends external:Guild
 */
export class KlasaGuild extends extender.get('Guild') {

	/**
	 * The guild level settings for this context (guild || default)
	 * @since 0.5.0
	 */
	public settings: Settings;

	public constructor(...args: any[]) {
		super(...args);

		this.settings = (this.client as KlasaClient).gateways.guilds.get(this.id, true);
	}

	/**
	 * The language configured for this guild
	 */
	get language(): Language | null {
		return (this.client as KlasaClient).languages.get(this.settings.language) || null;
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 * @returns {KlasaGuildJSON}
	 */
	toJSON() {
		return { ...super.toJSON(), settings: this.settings.toJSON() };
	}

}

extender.extend('Guild', (__) => KlasaGuild);
