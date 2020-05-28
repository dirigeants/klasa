import { Store, Client, Message } from '@klasa/core';
import { Finalizer } from './Finalizer';
import type { Stopwatch } from '@klasa/stopwatch';
import type { Command } from './Command';
/**
 * Stores all {@link Finalizer} pieces for use in Klasa.
 * @since 0.0.1
 */
export declare class FinalizerStore extends Store<Finalizer> {
    /**
     * Constructs our FinalizerStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: Client);
    /**
     * Runs all of our finalizers after a command is ran successfully.
     * @since 0.0.1
     * @param message The message that called the command
     * @param command The command this finalizer is for (may be different than message.command)
     * @param responses The responses of the command
     * @param timer The timer run from start to queue of the command
     */
    run(message: Message, command: Command, responses: Message[], timer: Stopwatch): void;
}
