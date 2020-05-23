import { extender } from '@klasa/core';

import type { Settings } from '../settings/Settings';
import type { Language } from '../structures/Language';

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

	/**
	 * @param {...*} args Normal D.JS Guild args
	 */
	constructor(...args) {
		super(...args);

		this.settings = this.client.gateways.guilds.get(this.id, true);
	}

	/**
	 * The language configured for this guild
	 * @type {?Language}
	 */
	get language(): Language {
		return this.client.languages.get(this.settings.language) || null;
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
