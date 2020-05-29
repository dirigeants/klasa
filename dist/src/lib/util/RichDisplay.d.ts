import { Embed, Message } from '@klasa/core';
import { Cache } from '@klasa/cache';
import { ReactionMethods, ReactionHandlerOptions, ReactionHandler } from './ReactionHandler';
declare type EmbedOrCallback = Embed | ((embed: Embed) => Embed);
export interface RichDisplayOptions {
    /**
     * The template embed
     * @default Embed
     */
    template?: EmbedOrCallback;
    /**
     * If the stop emoji should be included
     * @default true
     */
    stop?: boolean;
    /**
     * If the jump emoji should be included
     * @default true
     */
    jump?: boolean;
    /**
     * If the first and last emojis should be included
     * @default true
     */
    firstLast?: boolean;
}
/**
 * Klasa's RichDisplay, for helping paginated embeds with reaction buttons
 */
export declare class RichDisplay {
    /**
     * The stored pages of the display
     * @since 0.4.0
     */
    pages: Embed[];
    /**
     * An optional Info page/embed
     * @since 0.4.0
     */
    infoPage: Embed | null;
    /**
     * The emojis to use for this display
     * @since 0.4.0
     */
    protected _emojis: Cache<ReactionMethods, string>;
    /**
     * The embed template
     * @since 0.4.0
     */
    protected _template: Embed;
    /**
     * If footers have been applied to all pages
     * @since 0.4.0
     */
    protected _footered: boolean;
    /**
     * Adds a prefix to all footers (before page/pages)
     * @since 0.5.0
     */
    private footerPrefix;
    /**
     * Adds a suffix to all footers (after page/pages)
     * @since 0.5.0
     */
    private footerSuffix;
    /**
     * @param options The RichDisplay Options
     */
    constructor(options?: RichDisplayOptions);
    /**
     * Runs the RichDisplay
     * @since 0.4.0
     * @param message A message to either edit, or use to send a new message for this RichDisplay
     * @param options The options to use while running this RichDisplay
     */
    run(message: Message, options?: ReactionHandlerOptions): Promise<ReactionHandler>;
    /**
     * Sets emojis to a new set of emojis
     * @since 0.4.0
     * @param emojis An object containing replacement emojis to use instead
     */
    setEmojis(emojis: Record<ReactionMethods, string>): this;
    /**
     * Sets a prefix for all footers
     * @since 0.5.0
     * @param prefix The prefix you want to add
     */
    setFooterPrefix(prefix: string): this;
    /**
     * Sets a suffix for all footers
     * @since 0.5.0
     * @param suffix The suffix you want to add
     */
    setFooterSuffix(suffix: string): this;
    /**
     * Turns off the footer altering function
     * @since 0.5.0
     */
    useCustomFooters(): this;
    /**
     * Adds a page to the RichDisplay
     * @since 0.4.0
     * @param embed A callback with the embed template passed and the embed returned, or an embed
     */
    addPage(embed: EmbedOrCallback): this;
    /**
     * Adds an info page to the RichDisplay
     * @since 0.4.0
     * @param embed A callback with the embed template passed and the embed returned, or an embed
     */
    setInfoPage(embed: EmbedOrCallback): this;
    /**
     * A new instance of the template embed
     * @since 0.4.0
     */
    protected get template(): Embed;
    /**
     * Adds page of pages footers to all pages
     * @since 0.4.0
     */
    private footer;
    /**
     * Resolves the callback or Embed into a Embed
     * @since 0.4.0
     * @param embed The callback or embed
     */
    private resolveEmbedOrCallback;
}
export {};
