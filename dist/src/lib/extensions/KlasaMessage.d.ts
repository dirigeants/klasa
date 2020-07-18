import { MessageBuilder, Message, MessageOptions, SplitOptions } from '@klasa/core';
import { Cache } from '@klasa/cache';
import { APIMessageData } from '@klasa/dapi-types';
import type { Command } from '../structures/Command';
import type { Language } from '../structures/Language';
import type { CommandPrompt } from '../usage/CommandPrompt';
import type { Settings } from '../settings/Settings';
export interface CachedPrefix {
    length: number;
    regex: RegExp | null;
}
declare const KlasaMessage_base: import("@klasa/core").Constructor<Message>;
/**
 * Klasa's Extended Message
 */
export declare class KlasaMessage extends KlasaMessage_base {
    #private;
    /**
     * The command being ran.
     */
    command: Command | null;
    /**
     * The name of the command being ran.
     */
    commandText: string | null;
    /**
     * The prefix used.
     */
    prefix: RegExp | null;
    /**
     * The length of the prefix used.
     */
    prefixLength: number | null;
    /**
     * A command prompt/argument handler.
     */
    prompter: CommandPrompt | null;
    /**
     * The language for this message.
     */
    language: Language;
    /**
     * The guild level settings for this context (guild || default)
     */
    guildSettings: Settings;
    constructor(...args: any[]);
    /**
    * The previous responses to this message
    * @since 0.5.0
    */
    get responses(): Message[];
    /**
    * The string arguments derived from the usageDelim of the command
    * @since 0.0.1
    */
    get args(): (string | undefined | null)[];
    /**
    * The parameters resolved by this class
    * @since 0.0.1
    */
    get params(): unknown[];
    /**
    * The flags resolved by this class
    * @since 0.5.0
    */
    get flagArgs(): Record<string, string>;
    /**
    * If the command reprompted for missing args
    * @since 0.0.1
    */
    get reprompted(): boolean;
    /**
    * The usable commands by the author in this message's context
    * @since 0.0.1
    */
    usableCommands(): Promise<Cache<string, Command>>;
    /**
    * Checks if the author of this message, has applicable permission in this message's context of at least min
    * @since 0.0.1
    */
    hasAtLeastPermissionLevel(min: number): Promise<boolean>;
    /**
     * Sends a message to the channel.
     * @param data The {@link MessageBuilder builder} to send.
     * @param options The split options for the message.
     * @since 0.0.1
     * @see https://discord.com/developers/docs/resources/channel#create-message
     * @example
     * message.reply(new MessageBuilder()
     *     .setContent('Ping!')
     *     .setEmbed(new Embed().setDescription('From an embed!')));
     */
    reply(data: MessageOptions, options?: SplitOptions): Promise<Message[]>;
    /**
     * Sends a message to the channel.
     * @param data A callback with a {@link MessageBuilder builder} as an argument.
     * @param options The split options for the message.
     * @since 0.0.1
     * @see https://discord.com/developers/docs/resources/channel#create-message
     * @example
     * message.reply(builder => builder
     *     .setContent('Ping!')
     *     .setEmbed(embed => embed.setDescription('From an embed!')));
     */
    reply(data: (message: MessageBuilder) => MessageBuilder | Promise<MessageBuilder>, options?: SplitOptions): Promise<Message[]>;
    /**
     * Sends a message that will be editable via command editing (if nothing is attached)
     * @since 0.5.0
     * @param key The Language key to send
     * @param options The split options
     */
    replyLocale(key: string, options?: SplitOptions): Promise<Message[]>;
    /**
     * Sends a message that will be editable via command editing (if nothing is attached)
     * @since 0.5.0
     * @param key The Language key to send
     * @param localeArgs The language arguments to pass
     * @param options The split options
     */
    replyLocale(key: string, localeArgs?: unknown[], options?: SplitOptions): Promise<Message[]>;
    toJSON(): Record<string, unknown>;
    /**
     * Extends the patch method from Message to attach and update the language to this instance
     * @since 0.5.0
     */
    protected _patch(data: Partial<APIMessageData>): this;
    /**
    * Parses this message as a command
    * @since 0.5.0
    */
    private _parseCommand;
    /**
    * Checks if the per-guild or default prefix is used
    * @since 0.5.0
    */
    private _customPrefix;
    /**
    * Checks if the mention was used as a prefix
    * @since 0.5.0
    */
    private _mentionPrefix;
    /**
    * Checks if a prefixless scenario is possible
    * @since 0.5.0
    */
    private _prefixLess;
    /**
    * Caches a new prefix regexp
    * @since 0.5.0
    */
    private static generateNewPrefix;
    /**
    * Cache of RegExp prefixes
    * @since 0.5.0
    */
    private static prefixes;
}
declare module '@klasa/core/dist/src/lib/caching/structures/messages/Message' {
    interface Message {
        command: Command | null;
        commandText: string | null;
        prefix: RegExp | null;
        prefixLength: number | null;
        prompter: CommandPrompt | null;
        language: Language;
        guildSettings: Settings;
        readonly responses: Message[];
        readonly args: (string | undefined | null)[];
        readonly params: unknown[];
        readonly flagArgs: Record<string, string>;
        readonly reprompted: boolean;
        usableCommands(): Promise<Cache<string, Command>>;
        hasAtLeastPermissionLevel(min: number): Promise<boolean>;
        reply(data: MessageOptions, options?: SplitOptions): Promise<Message[]>;
        reply(data: (message: MessageBuilder) => MessageBuilder | Promise<MessageBuilder>, options?: SplitOptions): Promise<Message[]>;
        replyLocale(key: string, options?: SplitOptions): Promise<Message[]>;
        replyLocale(key: string, localeArgs?: unknown[], options?: SplitOptions): Promise<Message[]>;
    }
}
export {};
