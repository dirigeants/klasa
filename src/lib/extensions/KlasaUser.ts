import { extender } from '@klasa/core';

import type { Settings } from '../settings/Settings';
import type { Gateway } from '../settings/gateway/Gateway';

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

	public constructor(...args: readonly unknown[]) {
		super(...args);

		this.settings = (this.client.gateways.get('users') as Gateway).acquire(this);
	}

	/**
	 * Returns the JSON-compatible object of this instance.
	 * @since 0.5.0
	 */
	public toJSON(): Record<string, any> {
		return { ...super.toJSON(), settings: this.settings };
	}

}

extender.extend('User', () => KlasaUser);

declare module '@klasa/core/dist/src/lib/caching/structures/User' {

	export interface User {
		settings: Settings;
	}

}
