import { extender } from '@klasa/core';

import type { Settings } from '../settings/Settings';

/**
 * Klasa's Extended User
 * @extends external:User
 */
export class KlasaUser extends extender.get('User') {

	/**
	 * The user level settings for this context (user || default)
	 * @since 0.5.0
	 */
	public settings: Settings;

	/**
	 * @param {...*} args Normal D.JS User args
	 */
	constructor(...args) {
		super(...args);

		this.settings = this.client.gateways.users.get(this.id, true);
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 * @returns {KlasaUserJSON}
	 */
	toJSON() {
		return { ...super.toJSON(), settings: this.settings };
	}

}

extender.extend('User', (__): KlasaUser => KlasaUser);
