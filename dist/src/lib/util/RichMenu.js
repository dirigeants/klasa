"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichMenu = void 0;
const RichDisplay_1 = require("./RichDisplay");
require("./ReactionHandler");
const cache_1 = require("@klasa/cache");
const choiceMethods = [
    "one" /* One */,
    "two" /* Two */,
    "three" /* Three */,
    "four" /* Four */,
    "five" /* Five */,
    "six" /* Six */,
    "seven" /* Seven */,
    "eight" /* Eight */,
    "nine" /* Nine */,
    "ten" /* Ten */
];
/**
 * Klasa's RichMenu, for helping paginated embeds with reaction buttons
 */
class RichMenu extends RichDisplay_1.RichDisplay {
    /**
     * @param options The RichDisplay options
     */
    constructor(options) {
        super(options);
        /**
         * The menu choices
         * @since 0.6.0
         */
        this.choices = [];
        /**
         * If options have been paginated yet
         * @since 0.4.0
         */
        this.paginated = false;
        this._emojis = new cache_1.Cache([
            ["one" /* One */, '1️⃣'],
            ["two" /* Two */, '2️⃣'],
            ["three" /* Three */, '3️⃣'],
            ["four" /* Four */, '4️⃣'],
            ["five" /* Five */, '5️⃣'],
            ["six" /* Six */, '6️⃣'],
            ["seven" /* Seven */, '7️⃣'],
            ["eight" /* Eight */, '8️⃣'],
            ["nine" /* Nine */, '9️⃣'],
            ["ten" /* Ten */, '🔟'],
            ...this._emojis
        ]);
    }
    /**
     * You cannot directly add pages in a RichMenu
     * @since 0.4.0
     */
    addPage() {
        throw new Error('You cannot directly add pages in a RichMenu');
    }
    /**
     * Adds a menu choice
     * @since 0.6.0
     * @param name The name of the choice
     * @param body The description of the choice
     * @param inline Whether the choice should be inline
     */
    addChoice(name, body, inline = false) {
        this.choices.push({ name, body, inline });
        return this;
    }
    /**
     * Runs this RichMenu
     * @since 0.4.0
     * @param KlasaMessage message A message to edit or use to send a new message with
     * @param options The options to use with this RichMenu
     */
    async run(message, options = {}) {
        if (this.choices.length < choiceMethods.length) {
            for (let i = this.choices.length; i < choiceMethods.length; i++)
                this._emojis.delete(choiceMethods[i]);
        }
        if (!this.paginated)
            this.paginate();
        return super.run(message, options);
    }
    /**
     * Converts MenuOptions into display pages
     * @since 0.4.0
     */
    paginate() {
        const page = this.pages.length;
        if (this.paginated)
            return null;
        super.addPage(embed => {
            for (let i = 0, choice = this.choices[i + (page * 10)]; i + (page * 10) < this.choices.length && i < 10; i++, choice = this.choices[i + (page * 10)]) {
                embed.addField(`(${i + 1}) ${choice.name}`, choice.body, choice.inline);
            }
            return embed;
        });
        if (this.choices.length > (page + 1) * 10)
            return this.paginate();
        this.paginated = true;
        return null;
    }
}
exports.RichMenu = RichMenu;
//# sourceMappingURL=RichMenu.js.map