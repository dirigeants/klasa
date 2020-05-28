import { Cache } from '@klasa/cache';
import { Tag, TagRequirement, TagResponse } from './Tag';
import { TextPrompt, TextPromptOptions } from './TextPrompt';
import type { Client, Message } from '@klasa/core';
import type { Possible } from './Possible';
/**
 * Converts usage strings into objects to compare against later
 */
export declare class Usage {
    /**
     * The client this Usage was created with
     * @since 0.0.1
     */
    readonly client: Client;
    /**
     * The usage string re-deliminated with the usageDelim
     * @since 0.0.1
     */
    deliminatedUsage: string;
    /**
     * The usage string
     * @since 0.0.1
     */
    usageString: string;
    /**
     * The usage delim
     * @since 0.5.0
     */
    usageDelim: string;
    /**
     * The usage object to compare against later
     * @since 0.0.1
     */
    parsedUsage: Tag[];
    /**
     * Stores one-off custom resolvers for use with the custom type arg
     * @since 0.5.0
     */
    customResolvers: Cache<string, CustomUsageArgument>;
    /**
     * @since 0.0.1
     * @param client The klasa client
     * @param usageString The raw usage string
     * @param usageDelim The deliminator for this usage
     */
    constructor(client: Client, usageString: string, usageDelim: string);
    /**
     * Registers a one-off custom resolver
     * @since 0.5.0
     * @param type The type of the usage argument
     * @param resolver The one-off custom resolver
     * @chainable
     */
    createCustomResolver(type: string, resolver: CustomUsageArgument): this;
    /**
     * Customizes the response of an argument if it fails resolution.
     * @since 0.5.0
     * @param name The name of the usage argument
     * @param response The custom response or i18n function
     * @chainable
     */
    customizeResponse(name: string, response: string | TagResponse): this;
    /**
     * Creates a TextPrompt instance to collect and resolve arguments with.
     * @since 0.5.0
     * @param message The message context from the prompt
     * @param options The options for the prompt
     */
    createPrompt(message: Message, options?: TextPromptOptions): TextPrompt;
    /**
     * Defines json stringify behavior of this class.
     * @since 0.5.0
     */
    toJSON(): Tag[];
    /**
     * Defines to string behavior of this class.
     * @since 0.5.0
     */
    toString(): string;
    /**
     * Method responsible for building the usage object to check against
     * @since 0.0.1
     * @param usageString The usage string to parse
     */
    private static parseUsage;
    /**
     * Method responsible for handling tag opens
     * @since 0.0.1
     * @param usage The current usage interim object
     * @param char The character that triggered this function
     */
    private static tagOpen;
    /**
     * Method responsible for handling tag closes
     * @since 0.0.1
     * @param usage The current usage interim object
     * @param char The character that triggered this function
     */
    static tagClose(usage: UsageContext, char: string): void;
    /**
     * Method responsible for handling tag spacing
     * @since 0.0.1
     * @param usage The current usage interim object
     * @param char The character that triggered this function
     */
    private static tagSpace;
}
export interface CustomUsageArgument {
    /**
     * @since 0.5.0
     * @param argument The argument to be parsed.
     * @param possible The {@link Possible tag member} this argument belongs to.
     * @param message The message that is being parsed.
     * @param params The parsed parameters from the previous arguments.
     */
    (argument: string, possible: Possible, message: Message, params: unknown[]): unknown | Promise<unknown>;
}
interface UsageContext {
    tags: Tag[];
    opened: number;
    current: string;
    openRegex: boolean;
    openReq: TagRequirement;
    last: boolean;
    char: number;
    from: number;
    at: string;
    fromTo: string;
}
export {};
