"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichDisplay = void 0;
const core_1 = require("@klasa/core");
const cache_1 = require("@klasa/cache");
const ReactionHandler_1 = require("./ReactionHandler");
/**
 * Klasa's RichDisplay, for helping paginated embeds with reaction buttons
 */
class RichDisplay {
    /**
     * @param options The RichDisplay Options
     */
    constructor(options = {}) {
        var _a;
        /**
         * The stored pages of the display
         * @since 0.4.0
         */
        this.pages = [];
        /**
         * An optional Info page/embed
         * @since 0.4.0
         */
        this.infoPage = null;
        /**
         * The emojis to use for this display
         * @since 0.4.0
         */
        this._emojis = new cache_1.Cache();
        /**
         * If footers have been applied to all pages
         * @since 0.4.0
         */
        this._footered = false;
        /**
         * Adds a prefix to all footers (before page/pages)
         * @since 0.5.0
         */
        this.footerPrefix = '';
        /**
         * Adds a suffix to all footers (after page/pages)
         * @since 0.5.0
         */
        this.footerSuffix = '';
        this._template = this.resolveEmbedOrCallback((_a = options.template) !== null && _a !== void 0 ? _a : new core_1.Embed());
        this._emojis
            .set("first" /* First */, '⏮')
            .set("back" /* Back */, '◀')
            .set("forward" /* Forward */, '▶')
            .set("last" /* Last */, '⏭')
            .set("jump" /* Jump */, '🔢')
            .set("info" /* Info */, 'ℹ')
            .set("stop" /* Stop */, '⏹');
        // To maintain emoji order, we will delete from rather than insert according to options
        if (!options.firstLast) {
            this._emojis.delete("first" /* First */);
            this._emojis.delete("last" /* Last */);
        }
        if (!options.jump)
            this._emojis.delete("jump" /* Jump */);
        if (!options.stop)
            this._emojis.delete("stop" /* Stop */);
    }
    /**
     * Runs the RichDisplay
     * @since 0.4.0
     * @param message A message to either edit, or use to send a new message for this RichDisplay
     * @param options The options to use while running this RichDisplay
     */
    async run(message, options = {}) {
        if (!this.infoPage)
            this._emojis.delete("info" /* Info */);
        if (!this._footered)
            this.footer();
        let msg;
        if (message.editable) {
            await message.edit(mb => mb.setEmbed(this.pages[options.startPage || 0]));
            msg = message;
        }
        else {
            [msg] = await message.channel.send(mb => mb.setEmbed(this.pages[options.startPage || 0]));
        }
        return new ReactionHandler_1.ReactionHandler(msg, options, this, this._emojis);
    }
    /**
     * Sets emojis to a new set of emojis
     * @since 0.4.0
     * @param emojis An object containing replacement emojis to use instead
     */
    setEmojis(emojis) {
        for (const [key, value] of Object.entries(emojis)) {
            if (this._emojis.has(key))
                this._emojis.set(key, value);
        }
        return this;
    }
    /**
     * Sets a prefix for all footers
     * @since 0.5.0
     * @param prefix The prefix you want to add
     */
    setFooterPrefix(prefix) {
        this._footered = false;
        this.footerPrefix = prefix;
        return this;
    }
    /**
     * Sets a suffix for all footers
     * @since 0.5.0
     * @param suffix The suffix you want to add
     */
    setFooterSuffix(suffix) {
        this._footered = false;
        this.footerSuffix = suffix;
        return this;
    }
    /**
     * Turns off the footer altering function
     * @since 0.5.0
     */
    useCustomFooters() {
        this._footered = true;
        return this;
    }
    /**
     * Adds a page to the RichDisplay
     * @since 0.4.0
     * @param embed A callback with the embed template passed and the embed returned, or an embed
     */
    addPage(embed) {
        this.pages.push(this.resolveEmbedOrCallback(embed));
        return this;
    }
    /**
     * Adds an info page to the RichDisplay
     * @since 0.4.0
     * @param embed A callback with the embed template passed and the embed returned, or an embed
     */
    setInfoPage(embed) {
        this.infoPage = this.resolveEmbedOrCallback(embed);
        return this;
    }
    /**
     * A new instance of the template embed
     * @since 0.4.0
     */
    get template() {
        return new core_1.Embed(this._template);
    }
    /**
     * Adds page of pages footers to all pages
     * @since 0.4.0
     */
    footer() {
        for (let i = 1; i <= this.pages.length; i++)
            this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
        if (this.infoPage)
            this.infoPage.setFooter('ℹ');
    }
    /**
     * Resolves the callback or Embed into a Embed
     * @since 0.4.0
     * @param embed The callback or embed
     */
    resolveEmbedOrCallback(embed) {
        if (typeof embed === 'function') {
            const page = embed(this.template);
            if (page instanceof core_1.Embed)
                return page;
        }
        else if (embed instanceof core_1.Embed) {
            return embed;
        }
        throw new TypeError('Expected a Embed or Function returning a Embed');
    }
}
exports.RichDisplay = RichDisplay;
//# sourceMappingURL=RichDisplay.js.map