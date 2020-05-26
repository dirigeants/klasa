import { Serializer } from './Serializer';
import { AliasStore } from '@klasa/core';
import { KlasaClient } from '../Client';
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
    constructor(client: KlasaClient);
}
