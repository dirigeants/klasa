import { Argument } from './Argument';
import type { Message } from '@klasa/core';
import type { Possible } from '../usage/Possible';
/**
 * Base abstracted class for multi-resolving values.
 */
export declare class MultiArgument extends Argument {
    /**
     * A getter for the base argument
     * @since 0.5.0
     */
    get base(): Argument;
    /**
     * The run method for handling MultiArguments (not to be implemented in extended classes)
     * @since 0.5.0
     * @param {string} argument The string argument string to resolve
     * @param {Possible} possible This current usage possible
     * @param {Message} message The message that triggered the command
     */
    run(argument: string, possible: Possible, message: Message): Promise<any[]>;
}
