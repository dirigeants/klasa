import { MessageBuilder, Message, MessageOptions, SplitOptions } from '@klasa/core';
import { Cache } from '@klasa/cache';
import type { Command } from '../structures/Command';
import { APIMessageData } from '@klasa/dapi-types';
import { Language } from '../structures/Language';
import { Settings } from '../settings/Settings';
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
     * The language for this message.
     */
    language: Language;
    /**
     * The guild level settings for this context (guild || default)
     */
    guildSettings: Settings;
    /**
     * A command prompt/argument handler.
     */
    private prompter;
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
     * message.send(new MessageBuilder()
     *     .setContent('Ping!')
     *     .setEmbed(new Embed().setDescription('From an embed!')));
     */
    send(data: MessageOptions, options?: SplitOptions): Promise<Message[]>;
    /**
     * Sends a message to the channel.
     * @param data A callback with a {@link MessageBuilder builder} as an argument.
     * @param options The split options for the message.
     * @since 0.0.1
     * @see https://discord.com/developers/docs/resources/channel#create-message
     * @example
     * message.send(builder => builder
     *     .setContent('Ping!')
     *     .setEmbed(embed => embed.setDescription('From an embed!')));
     */
    send(data: (message: MessageBuilder) => MessageBuilder | Promise<MessageBuilder>, options?: SplitOptions): Promise<Message[]>;
    /**
     * Sends a message that will be editable via command editing (if nothing is attached)
     * @since 0.5.0
     * @param key The Language key to send
     * @param options The split options
     */
    sendLocale(key: string, options?: SplitOptions): Promise<Message[]>;
    /**
     * Sends a message that will be editable via command editing (if nothing is attached)
     * @since 0.5.0
     * @param key The Language key to send
     * @param localeArgs The language arguments to pass
     * @param options The split options
     */
    sendLocale(key: string, localeArgs?: unknown[], options?: SplitOptions): Promise<Message[]>;
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
    * Checks if the natural prefix is used
    * @since 0.5.0
    */
    private _naturalPrefix;
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
export {};
