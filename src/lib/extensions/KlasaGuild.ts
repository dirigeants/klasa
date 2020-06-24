import { extender } from '@klasa/core';

import type { Settings } from '../settings/Settings';
import type { Language } from '../structures/Language';
import type { Gateway } from '../settings/gateway/Gateway';

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

		this.settings = (this.client.gateways.get('guilds') as Gateway).acquire(this);
	}

	/**
	 * The language configured for this guild
	 */
	public get language(): Language {
		return this.client.languages.get(this.settings.get('language') as string) as Language;
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 */
	public toJSON(): Record<string, any> {
		return { ...super.toJSON(), settings: this.settings.toJSON() };
	}

}

extender.extend('Guild', () => KlasaGuild);

declare module '@klasa/core/dist/src/lib/caching/structures/guilds/Guild' {

	export interface Guild {
		settings: Settings;
		language: Language;
	}

}
