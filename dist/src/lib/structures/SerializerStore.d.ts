import { Serializer } from './Serializer';
import { AliasStore, Client } from '@klasa/core';
/**
 * Stores all {@link Serializer} pieces for use in Klasa.
 * @since 0.5.0
 */
export declare class SerializerStore extends AliasStore<Serializer> {
    /**
     * Constructs our SerializerStore for use in Klasa.
     * @since 0.5.0
     * @param client The Klasa client
     */
    constructor(client: Client);
}
