import { Extendable } from './Extendable';
import { Store, PieceConstructor, Client } from '@klasa/core';

/**
 * Stores all {@link Extendable} pieces for use in Klasa.
 * @since 0.0.1
 */
export class ExtendableStore extends Store<Extendable> {

	/**
	 * Constructs our ExtendableStore for use in Klasa.
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'extendables', Extendable as PieceConstructor<Extendable>);
	}

	/**
	 * Deletes an extendable from the store.
	 * @since 0.0.1
	 * @param name A extendable object or a string representing a command or alias name
	 */
	public remove(name: Extendable | string): boolean {
		const extendable = this.resolve(name);
		if (!extendable) return false;
		extendable.disable();
		return super.remove(extendable);
	}

	/**
	 * Clears the extendable from the store and removes the extensions.
	 * @since 0.0.1
	 */
	public clear(): void {
		for (const extendable of this.values()) this.remove(extendable);
	}

	/**
	 * Sets up an extendable in our store.
	 * @since 0.0.1
	 * @param piece The extendable piece we are setting up
	 */
	public add(piece: Extendable): Extendable | null {
		const extendable = super.add(piece);
		if (!extendable) return null;
		extendable.init();
		return extendable;
	}

}
