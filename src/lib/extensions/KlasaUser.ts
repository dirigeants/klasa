import { extender } from '@klasa/core';

/**
 * Klasa's Extended User
 * @extends external:User
 */
export class KlasaUser extends extender.get('User') {

	/**
	 * @typedef {external:UserJSON} KlasaUserJSON
	 * @property {SettingsJSON} settings The per user settings
	 */

	/**
	 * @param {...*} args Normal D.JS User args
	 */
	constructor(...args) {
		super(...args);

		/**
		 * The user level settings for this context (user || default)
		 * @since 0.5.0
		 * @type {Settings}
		 */
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
