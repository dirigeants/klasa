import { AliasStore } from '@klasa/core';
import { Argument } from './Argument';
import type { KlasaClient } from '../Client';
/**
 * Stores all {@link Argument} pieces for use in Klasa.
 * @since 0.0.1
 */
export declare class ArgumentStore extends AliasStore<Argument> {
    /**
     * Constructs our ArgumentStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: KlasaClient);
}
