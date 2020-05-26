import { Command } from './Command';
import { AliasStore } from '@klasa/core';
import type { KlasaClient } from '../Client';
/**
 * Stores all {@link Command} pieces for use in Klasa.
 * @since 0.0.1
 */
export declare class CommandStore extends AliasStore<Command> {
    /**
     * Constructs our CommandStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: KlasaClient);
}
