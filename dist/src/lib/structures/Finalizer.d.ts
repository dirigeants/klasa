import { Piece, Message } from '@klasa/core';
import type { Stopwatch } from '@klasa/stopwatch';
import type { Command } from './Command';
/**
 * Base class for all Klasa Finalizers. See {@tutorial CreatingFinalizers} for more information how to use this class
 * to build custom finalizers.
 * @tutorial CreatingFinalizers
 * @extends {Piece}
 */
export declare abstract class Finalizer extends Piece {
    /**
     * The run method to be overwritten in actual finalizers
     * @since 0.0.1
     * @param message The message used to trigger this finalizer
     * @param command The command this finalizer is for (may be different than message.command)
     * @param responses The bot's response message, if one is returned
     * @param runTime The time it took to generate the command
     */
    abstract run(message: Message, command: Command, responses: Message[] | undefined, runTime: Stopwatch): Promise<unknown> | unknown;
    /**
     * Run a finalizer and catch any uncaught promises
     * @since 0.5.0
     * @param message The message that called the command
     * @param command The command this finalizer is for (may be different than message.command)
     * @param responses The bot's response message, if one is returned
     * @param runTime The time it took to generate the command
     */
    protected _run(message: Message, command: Command, responses: Message[] | undefined, runTime: Stopwatch): Promise<void>;
}
