import { Inhibitor } from './Inhibitor';
import { Store } from '@klasa/core';
import type { KlasaClient } from '../Client';
import type { Command } from './Command';
import type { KlasaMessage } from '../extensions/KlasaMessage';
/**
 * Stores all {@link Inhibitor} pieces for use in Klasa
 */
export declare class InhibitorStore extends Store<Inhibitor> {
    /**
     * Constructs our InhibitorStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: KlasaClient);
    /**
     * Runs our inhibitors on the command.
     * @since 0.0.1
     * @param message The message object from @klasa/core
     * @param command The command being ran.
     * @param selective Whether or not we should ignore certain inhibitors to prevent spam.
     */
    run(message: KlasaMessage, command: Command, selective?: boolean): Promise<void>;
}
