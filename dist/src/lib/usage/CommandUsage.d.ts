import { Usage } from './Usage';
import { CommandPrompt } from './CommandPrompt';
import { KlasaClient } from '../Client';
import { Command } from '../structures/Command';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { TextPromptOptions } from './TextPrompt';
/**
 * Converts usage strings into objects to compare against later
 */
export declare class CommandUsage extends Usage {
    /**
     * All names and aliases for the command
     * @since 0.0.1
     */
    names: string[];
    /**
     * The compiled string for all names/aliases in a usage string
     * @since 0.0.1
     */
    commands: string;
    /**
     * The concatenated string of this.commands and this.deliminatedUsage
     * @since 0.0.1
     */
    nearlyFullUsage: string;
    /**
     * @since 0.0.1
     * @param client The klasa client
     * @param usageString The usage string for this command
     * @param usageDelim The usage deliminator for this command
     * @param command The command this parsed usage is for
     */
    constructor(client: KlasaClient, usageString: string, usageDelim: string, command: Command);
    /**
     * Creates a CommandPrompt instance to collect and resolve arguments with
     * @since 0.5.0
     * @param message The message context from the prompt
     * @param options The options for the prompt
     */
    createPrompt(message: KlasaMessage, options?: TextPromptOptions): CommandPrompt;
    /**
     * Creates a full usage string including prefix and commands/aliases for documentation/help purposes
     * @since 0.0.1
     * @param message The message context for which to generate usage for
     */
    fullUsage(message: KlasaMessage): string;
    /**
     * Defines to string behavior of this class.
     * @since 0.5.0
     */
    toString(): string;
}
