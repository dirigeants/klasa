import { Extendable } from './Extendable';
import { Store, Client } from '@klasa/core';
/**
 * Stores all {@link Extendable} pieces for use in Klasa.
 * @since 0.0.1
 */
export declare class ExtendableStore extends Store<Extendable> {
    /**
     * Constructs our ExtendableStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: Client);
    /**
     * Deletes an extendable from the store.
     * @since 0.0.1
     * @param name A extendable object or a string representing a command or alias name
     */
    remove(name: Extendable | string): boolean;
    /**
     * Clears the extendable from the store and removes the extensions.
     * @since 0.0.1
     */
    clear(): void;
    /**
     * Sets up an extendable in our store.
     * @since 0.0.1
     * @param piece The extendable piece we are setting up
     */
    add(piece: Extendable): Extendable | null;
}
