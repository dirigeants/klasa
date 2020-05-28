import { Command } from './Command';
import { AliasStore, Client } from '@klasa/core';
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
    constructor(client: Client);
}
