import type { Message, ReactionIteratorOptions } from '@klasa/core';
import type { Cache } from '@klasa/cache';
import type { RichDisplay } from './RichDisplay';
export interface ReactionHandlerOptions extends ReactionIteratorOptions {
    /**
     * The page to start on
     * @default 0
     */
    startPage?: number;
    /**
     * The text for the jump prompt
     * @default this.message.language.get('REACTIONHANDLER_PROMPT')
     */
    prompt?: string;
    /**
     * The timeout for the jump prompt
     * @default 30000
     */
    jumpTimeout?: number;
}
export declare const enum ReactionMethods {
    First = "first",
    Back = "back",
    Forward = "forward",
    Last = "last",
    Jump = "jump",
    Info = "info",
    Stop = "stop",
    One = "one",
    Two = "two",
    Three = "three",
    Four = "four",
    Five = "five",
    Six = "six",
    Seven = "seven",
    Eight = "eight",
    Nine = "nine",
    Ten = "ten"
}
/**
 * Klasa's ReactionHandler, for handling RichDisplay and RichMenu reaction input
 */
export declare class ReactionHandler {
    #private;
    /**
     * The selection of a RichMenu (useless in a RichDisplay scenario)
     * @since 0.4.0
     */
    readonly selection: Promise<number | null>;
    /**
     * The message of the RichDisplay/RichMenu
     * @since 0.6.0
     */
    private readonly message;
    /**
     * The RichDisplay/RichMenu this Handler is for
     * @since 0.4.0
     */
    private readonly display;
    /**
     * An emoji to method map, to map custom emojis to static method names
     * @since 0.4.0
     */
    private readonly methodMap;
    /**
     * The prompt to use when jumping pages
     * @since 0.4.0
     */
    private readonly prompt;
    /**
     * The amount of time before the jump menu should close
     * @since 0.4.0
     */
    private readonly jumpTimeout;
    /**
     * @param message The message to track reactions from
     * @param options The options for this reaction handler
     * @param display The display this reaction handler is for
     * @param emojis The emojis to manage this reaction handler
     */
    constructor(message: Message, options: ReactionHandlerOptions, display: RichDisplay, emojis: Cache<ReactionMethods, string>);
    /**
     * Stops this ReactionHandler
     * @since 0.6.0
     */
    stop(): boolean;
    /**
     * Attempts to choose a value
     * @param value The id of the choice made
     */
    private choose;
    /**
     * Runs this ReactionHandler
     * @param emojis The emojis to react
     * @param options The options for the Iterator
     */
    private run;
    /**
     * Updates the message.
     * @since 0.4.0
     */
    private update;
    /**
     * Reacts the initial Emojis
     * @param emojis The initial emojis left to react
     */
    private setup;
    /**
     * The reaction methods
     * @since 0.6.0
     */
    private static methods;
}
