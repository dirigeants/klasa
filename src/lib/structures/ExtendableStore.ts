import { Extendable } from './Extendable';
import { Store, PieceConstructor } from '@klasa/core';

import type { KlasaClient } from '../Client';

/**
 * Stores all of our extendables that extend @klasa/core and Klasa structures
 * @extends Store
 */
export class ExtendableStore extends Store<Extendable> {

	constructor(client: KlasaClient) {
		super(client, 'extendables', Extendable as PieceConstructor<Extendable>);
	}

	/**
	 * Deletes an extendable from the store.
	 * @since 0.0.1
	 * @param {Extendable|string} name A extendable object or a string representing a command or alias name
	 * @returns {boolean}
	 */
	delete(name: Extendable | string): boolean {
		const extendable = this.resolve(name);
		if (!extendable) return false;
		extendable.disable();
		return super.delete(extendable);
	}

	/**
	 * Clears the extendable from the store and removes the extensions.
	 * @since 0.0.1
	 */
	clear(): void {
		for (const extendable of this.values()) this.delete(extendable);
	}

	/**
	 * Sets up an extendable in our store.
	 * @since 0.0.1
	 * @param {Extendable} piece The extendable piece we are setting up
	 * @returns {?Extendable}
	 */
	public set(piece: Extendable): Extendable | null {
		const extendable = super.set(piece);
		if (!extendable) return null;
		extendable.init();
		return extendable;
	}

}
