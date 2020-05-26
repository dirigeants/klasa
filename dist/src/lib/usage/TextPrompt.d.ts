import { Cache } from '@klasa/cache';
import { Usage } from './Usage';
import { KlasaMessage } from '../extensions/KlasaMessage';
import { CommandUsage } from './CommandUsage';
import { KlasaClient } from '../Client';
import type { KlasaUser } from '../extensions/KlasaUser';
import type { TextBasedChannel, MessageOptions } from '@klasa/core';
export interface TextPromptOptions {
    /**
     * The intended target of this TextPrompt, if someone other than the author.
     * @default message.author
     */
    target?: KlasaUser;
    /**
     * The channel to prompt in, if other than this channel.
     * @default message.channel
     */
    channel?: TextBasedChannel;
    /**
     * The number of re-prompts before this TextPrompt gives up.
     * @default Infinity
     */
    limit?: number;
    /**
     * The time-limit for re-prompting.
     * @default 30000
     */
    time?: number;
    /**
     * Whether this prompt should respect quoted strings.
     * @default false
     */
    quotedStringSupport?: boolean;
    /**
     * Whether this prompt should respect flags.
     * @default true
     */
    flagSupport?: boolean;
}
/**
 * A class to handle argument collection and parameter resolution
 */
export declare class TextPrompt {
    #private;
    /**
     * The client this TextPrompt was created with
     * @since 0.5.0
     */
    readonly client: KlasaClient;
    /**
     * The message this prompt is for
     * @since 0.5.0
     */
    message: KlasaMessage;
    /**
     * The target this prompt is for
     * @since 0.5.0
     */
    target: KlasaUser;
    /**
     * The channel to prompt in
     * @since 0.5.0
     */
    channel: TextBasedChannel;
    /**
     * The usage for this prompt
     * @since 0.5.0
     */
    usage: Usage | CommandUsage;
    /**
     * If the command reprompted for missing args
     * @since 0.0.1
     */
    reprompted: boolean;
    /**
     * The flag arguments resolved by this class
     * @since 0.5.0
     */
    flags: Record<string, string>;
    /**
     * The string arguments derived from the usageDelim of the command
     * @since 0.0.1
     */
    args: (string | undefined | null)[];
    /**
     * The parameters resolved by this class
     * @since 0.0.1
     */
    params: unknown[];
    /**
     * The time-limit for re-prompting
     * @since 0.5.0
     */
    time: number;
    /**
     * The number of re-prompts before this TextPrompt gives up
     * @since 0.5.0
     */
    limit: number;
    /**
     * Whether this prompt should respect quoted strings
     * @since 0.5.0
     */
    quotedStringSupport: boolean;
    /**
     * Whether this prompt should respect flags
     * @since 0.5.0
     */
    flagSupport: boolean;
    /**
     * The typing state of this CommandPrompt
     * @since 0.5.0
     */
    protected typing: boolean;
    /**
     * A cache of the users responses
     * @since 0.5.0
     */
    responses: Cache<string, KlasaMessage>;
    /**
     * @since 0.5.0
     * @param message The message this prompt is for
     * @param usage The usage for this prompt
     * @param options The options of this prompt
     */
    constructor(message: KlasaMessage, usage: Usage, options?: TextPromptOptions);
    /**
     * Runs the custom prompt.
     * @since 0.5.0
     * @param prompt The message to initially prompt with
     * @returns The parameters resolved
     */
    run(prompt: MessageOptions): Promise<unknown[]>;
    private prompt;
    /**
     * Collects missing required arguments.
     * @since 0.5.0
     * @param prompt The reprompt error
     */
    reprompt(prompt: string): Promise<unknown[]>;
    /**
     * Collects repeating arguments.
     * @since 0.5.0
     */
    private repeatingPrompt;
    /**
     * Validates and resolves args into parameters
     * @since 0.0.1
     * @returns The resolved parameters
     */
    protected validateArgs(): Promise<unknown[]>;
    /**
     * Validates and resolves args into parameters, when multiple types of usage is defined
     * @since 0.0.1
     * @param index The id of the possible usage currently being checked
     * @returns The resolved parameters
     */
    private multiPossibles;
    /**
     * Pushes a parameter into this.params, and resets the re-prompt count.
     * @since 0.5.0
     * @param param The resolved parameter
     */
    private pushParam;
    /**
     * Decides if the prompter should reprompt or throw the error found while validating.
     * @since 0.5.0
     * @param err The error found while validating
     */
    private handleError;
    /**
     * Finalizes parameters and arguments for this prompt.
     * @since 0.5.0
     */
    private finalize;
    /**
     * Splits the original message string into arguments.
     * @since 0.5.0
     * @param original The original message string
     */
    private _setup;
    /**
     * Parses a message into string args
     * @since 0.5.0
     * @param content The remaining content
     * @param delim The delimiter
     */
    private static getFlags;
    /**
     * Parses a message into string args
     * @since 0.0.1
     * @param content The remaining content
     * @param delim The delimiter
     */
    private static getArgs;
    /**
     * Parses a message into string args taking into account quoted strings
     * @since 0.0.1
     * @param content The remaining content
     * @param delim The delimiter
     */
    private static getQuotedStringArgs;
    /**
     * Generate a new delimiter's RegExp and cache it
     * @since 0.5.0
     * @param delim The delimiter
     */
    private static generateNewDelim;
    /**
     * Map of RegExps caching usageDelim's RegExps.
     * @since 0.5.0
     */
    static delims: Cache<string, RegExp>;
    /**
     * Regular Expression to match flags with quoted string support.
     * @since 0.5.0
     */
    static flagRegex: RegExp;
}
