import { AliasPiece, Client, Message } from '@klasa/core';
import type { Possible } from '../usage/Possible';
import type { CustomUsageArgument } from '../usage/Usage';
/**
 * Base class for all Klasa Arguments. See {@tutorial CreatingArguments} for more information how to use this class
 * to build custom arguments.
 * @tutorial CreatingArguments
 */
export declare abstract class Argument extends AliasPiece {
    /**
     * The run method to be overwritten in actual Arguments
     * @since 0.5.0
     * @param argument The string argument string to resolve
     * @param possible This current usage possible
     * @param message The message that triggered the command
     */
    abstract run(argument: string, possible: Possible, message: Message, custom?: CustomUsageArgument): unknown | Promise<unknown>;
    /**
     * Checks min and max values
     * @since 0.5.0
     * @param client The client of this bot
     * @param value The value to check against
     * @param min The minimum value
     * @param max The maximum value
     * @param possible The id of the current possible usage
     * @param message The message that triggered the command
     * @param suffix An error suffix
     */
    protected static minOrMax(client: Client, value: number, min: number | null | undefined, max: number | null | undefined, possible: Possible, message: Message, suffix?: string): boolean;
    /**
     * Standard regular expressions for matching mentions and snowflake ids
     * @since 0.5.0
     */
    static regex: {
        userOrMember: RegExp;
        channel: RegExp;
        emoji: RegExp;
        role: RegExp;
        snowflake: RegExp;
    };
}
