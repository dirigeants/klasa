"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionHandler = void 0;
require("@klasa/dapi-types");
/**
 * Klasa's ReactionHandler, for handling RichDisplay and RichMenu reaction input
 */
class ReactionHandler {
    /**
     * @param message The message to track reactions from
     * @param options The options for this reaction handler
     * @param display The display this reaction handler is for
     * @param emojis The emojis to manage this reaction handler
     */
    constructor(message, options, display, emojis) {
        /**
         * If this ReactionHandler has ended
         * @since 0.6.0
         */
        this.#ended = false;
        /**
         * If we are awaiting a jump response
         */
        this.#awaiting = false;
        /**
         * Causes this.selection to resolve
         * @since 0.4.0
         */
        this.#resolve = null;
        if (message.channel.type === 1 /* DM */)
            throw new Error('RichDisplays and subclasses cannot be used in DMs, as they do not have enough permissions to perform in a UX friendly way.');
        this.message = message;
        this.display = display;
        this.methodMap = new Map(emojis.map((value, key) => [value, key]));
        this.prompt = options.prompt ?? message.language.get('REACTIONHANDLER_PROMPT');
        this.jumpTimeout = options.jumpTimeout ?? 30000;
        this.selection = emojis.has("one" /* One */) ? new Promise(resolve => {
            this.#resolve = resolve;
        }) : Promise.resolve(null);
        this.#currentPage = options.startPage ?? 0;
        this.run([...emojis.values()], options).then(options.onceDone);
    }
    /**
     * If this ReactionHandler has ended
     * @since 0.6.0
     */
    #ended;
    /**
     * If we are awaiting a jump response
     */
    #awaiting;
    /**
     * The current page the display is on
     * @since 0.4.0
     */
    #currentPage;
    /**
     * Causes this.selection to resolve
     * @since 0.4.0
     */
    #resolve;
    /**
     * Stops this ReactionHandler
     * @since 0.6.0
     */
    stop() {
        this.#ended = true;
        if (this.#resolve)
            this.#resolve(null);
        return true;
    }
    /**
     * Attempts to choose a value
     * @param value The id of the choice made
     */
    choose(value) {
        if (this.display.choices.length - 1 < value)
            return Promise.resolve(false);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.#resolve(value);
        this.#ended = true;
        return Promise.resolve(true);
    }
    /**
     * Runs this ReactionHandler
     * @param emojis The emojis to react
     * @param options The options for the Iterator
     */
    async run(emojis, options) {
        try {
            this.setup(emojis);
            for await (const [reaction, user] of this.message.reactions.iterate(options)) {
                if (this.#ended)
                    break;
                if (user === reaction.client.user)
                    continue;
                const method = this.methodMap.get((reaction.emoji.name ?? reaction.emoji.id));
                if (!method)
                    continue;
                const signals = await Promise.all([reaction.users.remove(user.id), this.constructor.methods.get(method)?.call(this, user)]);
                if (signals[1])
                    break;
            }
        }
        catch {
            // noop
        }
        finally {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (!this.message.deleted && this.message.client.guilds.has(this.message.guild.id)) {
                try {
                    await this.message.reactions.remove();
                }
                catch (error) {
                    this.message.client.emit('error', error);
                }
            }
        }
    }
    /**
     * Updates the message.
     * @since 0.4.0
     */
    async update() {
        if (this.message.deleted)
            return true;
        await this.message.edit(mb => mb.setEmbed(this.display.pages[this.#currentPage]));
        return false;
    }
    /**
     * Reacts the initial Emojis
     * @param emojis The initial emojis left to react
     */
    async setup(emojis) {
        if (this.message.deleted)
            return this.stop();
        if (this.#ended)
            return false;
        try {
            await this.message.reactions.add(emojis.shift());
        }
        catch {
            return this.stop();
        }
        if (emojis.length)
            return this.setup(emojis);
        return false;
    }
}
exports.ReactionHandler = ReactionHandler;
/* eslint-disable no-invalid-this, func-names */
/**
 * The reaction methods
 * @since 0.6.0
 */
ReactionHandler.methods = new Map()
    .set("first" /* First */, function () {
    this.#currentPage = 0;
    return this.update();
})
    .set("back" /* Back */, function () {
    if (this.#currentPage <= 0)
        return Promise.resolve(false);
    this.#currentPage--;
    return this.update();
})
    .set("forward" /* Forward */, function () {
    if (this.#currentPage > this.display.pages.length - 1)
        return Promise.resolve(false);
    this.#currentPage++;
    return this.update();
})
    .set("last" /* Last */, function () {
    this.#currentPage = this.display.pages.length - 1;
    return this.update();
})
    .set("jump" /* Jump */, async function (user) {
    if (this.#awaiting)
        return Promise.resolve(false);
    this.#awaiting = true;
    const [message] = await this.message.channel.send(mb => mb.setContent(this.prompt));
    const collected = await this.message.channel.awaitMessages({ filter: ([mess]) => mess.author === user, limit: 1, idle: this.jumpTimeout });
    this.#awaiting = false;
    await message.delete();
    const response = collected.firstValue;
    if (!response)
        return Promise.resolve(false);
    const newPage = parseInt(response.content);
    await response.delete();
    if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
        this.#currentPage = newPage - 1;
        return this.update();
    }
    return Promise.resolve(false);
})
    .set("info" /* Info */, async function () {
    if (this.message.deleted)
        return true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.message.edit(mb => mb.setEmbed(this.display.infoPage));
    return false;
})
    .set("stop" /* Stop */, function () {
    return Promise.resolve(this.stop());
})
    .set("one" /* One */, function () {
    return this.choose(this.#currentPage * 10);
})
    .set("two" /* Two */, function () {
    return this.choose(1 + (this.#currentPage * 10));
})
    .set("three" /* Three */, function () {
    return this.choose(2 + (this.#currentPage * 10));
})
    .set("four" /* Four */, function () {
    return this.choose(3 + (this.#currentPage * 10));
})
    .set("five" /* Five */, function () {
    return this.choose(4 + (this.#currentPage * 10));
})
    .set("six" /* Six */, function () {
    return this.choose(5 + (this.#currentPage * 10));
})
    .set("seven" /* Seven */, function () {
    return this.choose(6 + (this.#currentPage * 10));
})
    .set("eight" /* Eight */, function () {
    return this.choose(7 + (this.#currentPage * 10));
})
    .set("nine" /* Nine */, function () {
    return this.choose(8 + (this.#currentPage * 10));
})
    .set("ten" /* Ten */, function () {
    return this.choose(9 + (this.#currentPage * 10));
});
//# sourceMappingURL=ReactionHandler.js.map