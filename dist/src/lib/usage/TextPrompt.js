"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _repeat, _required, _prompted, _currentUsage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextPrompt = void 0;
/* eslint-disable no-dupe-class-members */
const utils_1 = require("@klasa/utils");
const cache_1 = require("@klasa/cache");
const quotes = ['"', "'", '“”', '‘’'];
/**
 * A class to handle argument collection and parameter resolution
 */
class TextPrompt {
    /**
     * @since 0.5.0
     * @param message The message this prompt is for
     * @param usage The usage for this prompt
     * @param options The options of this prompt
     */
    constructor(message, usage, options = {}) {
        var _a, _b;
        /**
         * If the command reprompted for missing args
         * @since 0.0.1
         */
        this.reprompted = false;
        /**
         * The flag arguments resolved by this class
         * @since 0.5.0
         */
        this.flags = {};
        /**
         * The string arguments derived from the usageDelim of the command
         * @since 0.0.1
         */
        this.args = [];
        /**
         * The parameters resolved by this class
         * @since 0.0.1
         */
        this.params = [];
        /**
         * A cache of the users responses
         * @since 0.5.0
         */
        this.responses = new cache_1.Cache();
        /**
         * Whether the current usage is a repeating arg
         * @since 0.0.1
         */
        _repeat.set(this, false);
        /**
         * Whether the current usage is required
         * @since 0.0.1
         */
        _required.set(this, 0 /* Optional */);
        /**
         * How many time this class has reprompted
         * @since 0.0.1
         */
        _prompted.set(this, 0);
        /**
         * A cache of the current usage while validating
         * @since 0.0.1
         */
        _currentUsage.set(this, null);
        options = utils_1.mergeDefault(message.client.options.commands.prompts, options);
        Object.defineProperty(this, 'client', { value: message.client });
        this.message = message;
        this.target = (_a = options.target) !== null && _a !== void 0 ? _a : message.author;
        this.typing = false;
        this.channel = (_b = options.channel) !== null && _b !== void 0 ? _b : message.channel;
        this.usage = usage;
        this.time = options.time;
        this.limit = options.limit;
        this.quotedStringSupport = options.quotedStringSupport;
        this.flagSupport = options.flagSupport;
    }
    /**
     * Runs the custom prompt.
     * @since 0.5.0
     * @param prompt The message to initially prompt with
     * @returns The parameters resolved
     */
    async run(prompt) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const message = await this.prompt(prompt);
        this.responses.set(message.id, message);
        this._setup(message.content);
        return this.validateArgs();
    }
    /**
     * Prompts the target for a response
     * @since 0.5.0
     * @param data The message to prompt with
     */
    async prompt(data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const [message] = await this.channel.send(data);
        const responses = await message.channel.awaitMessages({ idle: this.time, limit: 1, filter: ([msg]) => msg.author === this.target });
        message.delete();
        if (responses.size === 0)
            throw this.message.language.get('MESSAGE_PROMPT_TIMEOUT');
        return responses.firstValue;
    }
    /**
     * Collects missing required arguments.
     * @since 0.5.0
     * @param prompt The reprompt error
     */
    async reprompt(prompt) {
        __classPrivateFieldSet(this, _prompted, +__classPrivateFieldGet(this, _prompted) + 1);
        if (this.typing)
            this.message.channel.typing.stop();
        const abortTerm = this.message.language.get('TEXT_PROMPT_ABORT');
        const oldContent = this.message.content;
        const message = await this.prompt(mb => mb
            .setContent(this.message.language.get('MONITOR_COMMAND_HANDLER_REPROMPT', `<@!${this.target.id}>`, prompt, this.time / 1000, abortTerm)));
        if (this.message.content !== oldContent || message.prefix || message.content.toLowerCase() === abortTerm) {
            throw this.message.language.get('MONITOR_COMMAND_HANDLER_ABORTED');
        }
        this.responses.set(message.id, message);
        if (this.typing)
            this.message.channel.typing.start();
        this.args[this.args.lastIndexOf(null)] = message.content;
        this.reprompted = true;
        if (this.usage.parsedUsage[this.params.length].repeat)
            return this.repeatingPrompt();
        return this.validateArgs();
    }
    /**
     * Collects repeating arguments.
     * @since 0.5.0
     */
    async repeatingPrompt() {
        if (this.typing)
            this.message.channel.typing.stop();
        let message;
        const abortTerm = this.message.language.get('TEXT_PROMPT_ABORT');
        try {
            message = await this.prompt(mb => mb
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                .setContent(this.message.language.get('MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT', `<@!${this.message.author.id}>`, __classPrivateFieldGet(this, _currentUsage).possibles[0].name, this.time / 1000, abortTerm)));
            this.responses.set(message.id, message);
        }
        catch (err) {
            return this.validateArgs();
        }
        if (message.content.toLowerCase() === abortTerm)
            return this.validateArgs();
        if (this.typing)
            this.message.channel.typing.start();
        this.args.push(message.content);
        this.reprompted = true;
        return this.repeatingPrompt();
    }
    /**
     * Validates and resolves args into parameters
     * @since 0.0.1
     * @returns The resolved parameters
     */
    async validateArgs() {
        var _a;
        if (this.params.length >= this.usage.parsedUsage.length && this.params.length >= this.args.length) {
            return this.finalize();
        }
        else if (this.params.length < this.usage.parsedUsage.length) {
            __classPrivateFieldSet(this, _currentUsage, this.usage.parsedUsage[this.params.length]);
            __classPrivateFieldSet(this, _required, __classPrivateFieldGet(this, _currentUsage).required);
        }
        else if ((_a = __classPrivateFieldGet(this, _currentUsage)) === null || _a === void 0 ? void 0 : _a.repeat) {
            __classPrivateFieldSet(this, _required, 0);
            __classPrivateFieldSet(this, _repeat, true);
        }
        else {
            return this.finalize();
        }
        __classPrivateFieldSet(this, _prompted, 0);
        return this.multiPossibles(0);
    }
    /**
     * Validates and resolves args into parameters, when multiple types of usage is defined
     * @since 0.0.1
     * @param index The id of the possible usage currently being checked
     * @returns The resolved parameters
     */
    async multiPossibles(index) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const possible = __classPrivateFieldGet(this, _currentUsage).possibles[index];
        const custom = this.usage.customResolvers.get(possible.type);
        const resolver = this.client.arguments.get(custom ? 'custom' : possible.type);
        if (possible.name in this.flags)
            this.args.splice(this.params.length, 0, this.flags[possible.name]);
        if (!resolver) {
            this.client.emit('warn', `Unknown Argument Type encountered: ${possible.type}`);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (__classPrivateFieldGet(this, _currentUsage).possibles.length === 1)
                return this.pushParam(undefined);
            return this.multiPossibles(++index);
        }
        try {
            const res = await resolver.run(this.args[this.params.length], possible, this.message, custom);
            if (typeof res === 'undefined' && __classPrivateFieldGet(this, _required) === 1)
                this.args.splice(this.params.length, 0, undefined);
            return this.pushParam(res);
        }
        catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (index < __classPrivateFieldGet(this, _currentUsage).possibles.length - 1)
                return this.multiPossibles(++index);
            if (!__classPrivateFieldGet(this, _required)) {
                if (__classPrivateFieldGet(this, _repeat))
                    this.args.splice(this.params.length, 1);
                else
                    this.args.splice(this.params.length, 0, undefined);
                return __classPrivateFieldGet(this, _repeat) ? this.validateArgs() : this.pushParam(undefined);
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { response } = __classPrivateFieldGet(this, _currentUsage);
            const error = typeof response === 'function' ? response(this.message, possible) : response;
            if (__classPrivateFieldGet(this, _required) === 1)
                return this.handleError(error || err);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (__classPrivateFieldGet(this, _currentUsage).possibles.length === 1) {
                return this.handleError(error || (this.args[this.params.length] === undefined ? this.message.language.get('COMMANDMESSAGE_MISSING_REQUIRED', possible.name) : err));
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.handleError(error || this.message.language.get('COMMANDMESSAGE_NOMATCH', __classPrivateFieldGet(this, _currentUsage).possibles.map(poss => poss.name).join(', ')));
        }
    }
    /**
     * Pushes a parameter into this.params, and resets the re-prompt count.
     * @since 0.5.0
     * @param param The resolved parameter
     */
    pushParam(param) {
        this.params.push(param);
        return this.validateArgs();
    }
    /**
     * Decides if the prompter should reprompt or throw the error found while validating.
     * @since 0.5.0
     * @param err The error found while validating
     */
    async handleError(err) {
        this.args.splice(this.params.length, 1, null);
        if (this.limit && __classPrivateFieldGet(this, _prompted) < this.limit)
            return this.reprompt(err);
        throw err;
    }
    /**
     * Finalizes parameters and arguments for this prompt.
     * @since 0.5.0
     */
    finalize() {
        for (let i = this.params.length - 1; i >= 0 && this.params[i] === undefined; i--)
            this.params.pop();
        for (let i = this.args.length - 1; i >= 0 && this.args[i] === undefined; i--)
            this.args.pop();
        return this.params;
    }
    /**
     * Splits the original message string into arguments.
     * @since 0.5.0
     * @param original The original message string
     */
    _setup(original) {
        const { content, flags } = this.flagSupport ? this.constructor.getFlags(original, this.usage.usageDelim) : { content: original, flags: {} };
        this.flags = flags;
        this.args = this.quotedStringSupport ?
            this.constructor.getQuotedStringArgs(content, this.usage.usageDelim).map(arg => arg.trim()) :
            this.constructor.getArgs(content, this.usage.usageDelim).map(arg => arg.trim());
    }
    /**
     * Parses a message into string args
     * @since 0.5.0
     * @param content The remaining content
     * @param delim The delimiter
     */
    static getFlags(content, delim) {
        const flags = {};
        content = content.replace(this.flagRegex, (_match, fl, ...quote) => {
            flags[fl] = (quote.slice(0, -2).find(el => el) || fl).replace(/\\/g, '');
            return '';
        });
        if (delim)
            content = content.replace(this.delims.get(delim) || this.generateNewDelim(delim), '$1').trim();
        return { content, flags };
    }
    /**
     * Parses a message into string args
     * @since 0.0.1
     * @param content The remaining content
     * @param delim The delimiter
     */
    static getArgs(content, delim) {
        const args = delim !== '' ? content.split(delim) : [content];
        return args.length === 1 && args[0] === '' ? [] : args;
    }
    /**
     * Parses a message into string args taking into account quoted strings
     * @since 0.0.1
     * @param content The remaining content
     * @param delim The delimiter
     */
    static getQuotedStringArgs(content, delim) {
        if (!delim || delim === '')
            return [content];
        const args = [];
        for (let i = 0; i < content.length; i++) {
            let current = '';
            if (content.slice(i, i + delim.length) === delim) {
                i += delim.length - 1;
                continue;
            }
            const quote = quotes.find(qt => qt.includes(content[i]));
            if (quote) {
                const qts = quote.split('');
                while (i + 1 < content.length && (content[i] === '\\' || !qts.includes(content[i + 1])))
                    current += content[++i] === '\\' && qts.includes(content[i + 1]) ? '' : content[i];
                i++;
                args.push(current);
            }
            else {
                current += content[i];
                while (i + 1 < content.length && content.slice(i + 1, i + delim.length + 1) !== delim)
                    current += content[++i];
                args.push(current);
            }
        }
        return args.length === 1 && args[0] === '' ? [] : args;
    }
    /**
     * Generate a new delimiter's RegExp and cache it
     * @since 0.5.0
     * @param delim The delimiter
     */
    static generateNewDelim(delim) {
        const regex = new RegExp(`(${delim})(?:${delim})+`, 'g');
        this.delims.set(delim, regex);
        return regex;
    }
}
exports.TextPrompt = TextPrompt;
_repeat = new WeakMap(), _required = new WeakMap(), _prompted = new WeakMap(), _currentUsage = new WeakMap();
/**
 * Map of RegExps caching usageDelim's RegExps.
 * @since 0.5.0
 */
TextPrompt.delims = new cache_1.Cache();
/**
 * Regular Expression to match flags with quoted string support.
 * @since 0.5.0
 */
TextPrompt.flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map(qu => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join('|')}|([\\w<>@#&!-]+)))?`, 'g');
//# sourceMappingURL=TextPrompt.js.map