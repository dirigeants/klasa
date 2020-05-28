import { TextPrompt, TextPromptOptions } from './TextPrompt';
import type { Message } from '@klasa/core';
import type { CommandUsage } from './CommandUsage';
/**
 * A class to handle argument collection and parameter resolution for commands
 * @extends TextPrompt
 */
export declare class CommandPrompt extends TextPrompt {
    /**
     * @since 0.5.0
     * @param message The message for the command
     * @param usage The usage of the command
     * @param options The options for this CommandPrompt
     */
    constructor(message: Message, usage: CommandUsage, options?: TextPromptOptions);
    /**
     * Runs the internal validation, and re-prompts according to the settings
     * @since 0.5.0
     * @returns The parameters resolved
     */
    run(): Promise<unknown[]>;
}
