"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _ended, _awaiting, _currentPage, _resolve;
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
        var _a, _b, _c;
        /**
         * If this ReactionHandler has ended
         * @since 0.6.0
         */
        _ended.set(this, false);
        /**
         * If we are awaiting a jump response
         */
        _awaiting.set(this, false);
        /**
         * The current page the display is on
         * @since 0.4.0
         */
        _currentPage.set(this, void 0);
        /**
         * Causes this.selection to resolve
         * @since 0.4.0
         */
        _resolve.set(this, null);
        if (message.channel.type === 1 /* DM */)
            throw new Error('RichDisplays and subclasses cannot be used in DMs, as they do not have enough permissions to perform in a UX friendly way.');
        this.message = message;
        this.display = display;
        this.methodMap = new Map(emojis.map((value, key) => [value, key]));
        this.prompt = (_a = options.prompt) !== null && _a !== void 0 ? _a : message.language.get('REACTIONHANDLER_PROMPT');
        this.jumpTimeout = (_b = options.jumpTimeout) !== null && _b !== void 0 ? _b : 30000;
        this.selection = emojis.has("one" /* One */) ? new Promise(resolve => {
            __classPrivateFieldSet(this, _resolve, resolve);
        }) : Promise.resolve(null);
        __classPrivateFieldSet(this, _currentPage, (_c = options.startPage) !== null && _c !== void 0 ? _c : 0);
        this.run([...emojis.values()], options).then(options.onceDone);
    }
    /**
     * Stops this ReactionHandler
     * @since 0.6.0
     */
    stop() {
        __classPrivateFieldSet(this, _ended, true);
        if (__classPrivateFieldGet(this, _resolve))
            __classPrivateFieldGet(this, _resolve).call(this, null);
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
        __classPrivateFieldGet(this, _resolve)(value);
        __classPrivateFieldSet(this, _ended, true);
        return Promise.resolve(true);
    }
    /**
     * Runs this ReactionHandler
     * @param emojis The emojis to react
     * @param options The options for the Iterator
     */
    async run(emojis, options) {
        var _a, _b;
        try {
            this.setup(emojis);
            for await (const [reaction, user] of this.message.reactions.iterate(options)) {
                if (__classPrivateFieldGet(this, _ended))
                    break;
                if (user === reaction.client.user)
                    continue;
                const method = this.methodMap.get(((_a = reaction.emoji.name) !== null && _a !== void 0 ? _a : reaction.emoji.id));
                if (!method)
                    continue;
                const signals = await Promise.all([reaction.users.remove(user.id), (_b = this.constructor.methods.get(method)) === null || _b === void 0 ? void 0 : _b.call(this, user)]);
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
        await this.message.edit(mb => mb.setEmbed(this.display.pages[__classPrivateFieldGet(this, _currentPage)]));
        return false;
    }
    /**
     * Reacts the initial Emojis
     * @param emojis The initial emojis left to react
     */
    async setup(emojis) {
        if (this.message.deleted)
            return this.stop();
        if (__classPrivateFieldGet(this, _ended))
            return true;
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
_ended = new WeakMap(), _awaiting = new WeakMap(), _currentPage = new WeakMap(), _resolve = new WeakMap();
/* eslint-disable no-invalid-this, func-names */
/**
 * The reaction methods
 * @since 0.6.0
 */
ReactionHandler.methods = new Map()
    .set("first" /* First */, function () {
    __classPrivateFieldSet(this, _currentPage, 0);
    return this.update();
})
    .set("back" /* Back */, function () {
    if (__classPrivateFieldGet(this, _currentPage) <= 0)
        return Promise.resolve(false);
    __classPrivateFieldSet(this, _currentPage, +__classPrivateFieldGet(this, _currentPage) - 1);
    return this.update();
})
    .set("forward" /* Forward */, function () {
    if (__classPrivateFieldGet(this, _currentPage) > this.display.pages.length - 1)
        return Promise.resolve(false);
    __classPrivateFieldSet(this, _currentPage, +__classPrivateFieldGet(this, _currentPage) + 1);
    return this.update();
})
    .set("last" /* Last */, function () {
    __classPrivateFieldSet(this, _currentPage, this.display.pages.length - 1);
    return this.update();
})
    .set("jump" /* Jump */, async function (user) {
    if (__classPrivateFieldGet(this, _awaiting))
        return Promise.resolve(false);
    __classPrivateFieldSet(this, _awaiting, true);
    const [message] = await this.message.channel.send(mb => mb.setContent(this.prompt));
    const collected = await this.message.channel.awaitMessages({ filter: ([mess]) => mess.author === user, limit: 1, idle: this.jumpTimeout });
    __classPrivateFieldSet(this, _awaiting, false);
    await message.delete();
    const response = collected.firstValue;
    if (!response)
        return Promise.resolve(false);
    const newPage = parseInt(response.content);
    await response.delete();
    if (newPage && newPage > 0 && newPage <= this.display.pages.length) {
        __classPrivateFieldSet(this, _currentPage, newPage - 1);
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
    return this.choose(__classPrivateFieldGet(this, _currentPage) * 10);
})
    .set("two" /* Two */, function () {
    return this.choose(1 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("three" /* Three */, function () {
    return this.choose(2 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("four" /* Four */, function () {
    return this.choose(3 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("five" /* Five */, function () {
    return this.choose(4 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("six" /* Six */, function () {
    return this.choose(5 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("seven" /* Seven */, function () {
    return this.choose(6 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("eight" /* Eight */, function () {
    return this.choose(7 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("nine" /* Nine */, function () {
    return this.choose(8 + (__classPrivateFieldGet(this, _currentPage) * 10));
})
    .set("ten" /* Ten */, function () {
    return this.choose(9 + (__classPrivateFieldGet(this, _currentPage) * 10));
});
//# sourceMappingURL=ReactionHandler.js.map