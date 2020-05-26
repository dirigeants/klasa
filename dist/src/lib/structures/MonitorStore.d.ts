import { Monitor } from './Monitor';
import { Store } from '@klasa/core';
import type { KlasaClient } from '../Client';
import type { KlasaMessage } from '../extensions/KlasaMessage';
/**
 * Stores all {@link Monitor} pieces for use in Klasa.
 * @since 0.0.1
 */
export declare class MonitorStore extends Store<Monitor> {
    /**
     * Constructs our MonitorStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: KlasaClient);
    /**
     * Runs our monitors on the message.
     * @since 0.0.1
     * @param message The message to be used in the {@link Monitor monitors}.
     */
    run(message: KlasaMessage): void;
}
