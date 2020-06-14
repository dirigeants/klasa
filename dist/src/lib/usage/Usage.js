"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usage = void 0;
const cache_1 = require("@klasa/cache");
const Tag_1 = require("./Tag");
const TextPrompt_1 = require("./TextPrompt");
const open = ['[', '(', '<'];
const close = [']', ')', '>'];
const space = [' ', '\n'];
/**
 * Converts usage strings into objects to compare against later
 */
class Usage {
    /**
     * @since 0.0.1
     * @param client The klasa client
     * @param usageString The raw usage string
     * @param usageDelim The deliminator for this usage
     */
    constructor(client, usageString, usageDelim) {
        /**
         * Stores one-off custom resolvers for use with the custom type arg
         * @since 0.5.0
         */
        this.customResolvers = new cache_1.Cache();
        Object.defineProperty(this, 'client', { value: client });
        this.deliminatedUsage = usageString !== '' ? ` ${usageString.split(' ').join(usageDelim)}` : '';
        this.usageString = usageString;
        this.usageDelim = usageDelim;
        this.parsedUsage = this.constructor.parseUsage(this.usageString);
    }
    /**
     * Registers a one-off custom resolver
     * @since 0.5.0
     * @param type The type of the usage argument
     * @param resolver The one-off custom resolver
     * @chainable
     */
    createCustomResolver(type, resolver) {
        this.customResolvers.set(type, resolver);
        return this;
    }
    /**
     * Customizes the response of an argument if it fails resolution.
     * @since 0.5.0
     * @param name The name of the usage argument
     * @param response The custom response or i18n function
     * @chainable
     */
    customizeResponse(name, response) {
        this.parsedUsage.some(tag => tag.register(name, response));
        return this;
    }
    /**
     * Creates a TextPrompt instance to collect and resolve arguments with.
     * @since 0.5.0
     * @param message The message context from the prompt
     * @param options The options for the prompt
     */
    createPrompt(message, options = {}) {
        return new TextPrompt_1.TextPrompt(message, this, options);
    }
    /**
     * Defines json stringify behavior of this class.
     * @since 0.5.0
     */
    toJSON() {
        return this.parsedUsage;
    }
    /**
     * Defines to string behavior of this class.
     * @since 0.5.0
     */
    toString() {
        return this.deliminatedUsage;
    }
    /**
     * Method responsible for building the usage object to check against
     * @since 0.0.1
     * @param usageString The usage string to parse
     */
    static parseUsage(usageString) {
        const usage = {
            tags: [],
            opened: 0,
            current: '',
            openRegex: false,
            openReq: 0 /* Optional */,
            last: false,
            char: 0,
            from: 0,
            at: '',
            fromTo: ''
        };
        for (let i = 0; i < usageString.length; i++) {
            const char = usageString[i];
            usage.char = i + 1;
            usage.from = usage.char - usage.current.length;
            usage.at = `at char #${usage.char} '${char}'`;
            usage.fromTo = `from char #${usage.from} to #${usage.char} '${usage.current}'`;
            if (usage.last && char !== ' ')
                throw `${usage.at}: there can't be anything else after the repeat tag.`;
            if (char === '/' && usage.current[usage.current.length - 1] !== '\\')
                usage.openRegex = !usage.openRegex;
            if (usage.openRegex) {
                usage.current += char;
                continue;
            }
            if (open.includes(char))
                this.tagOpen(usage, char);
            else if (close.includes(char))
                this.tagClose(usage, char);
            else if (space.includes(char))
                this.tagSpace(usage, char);
            else
                usage.current += char;
        }
        if (usage.opened)
            throw `from char #${usageString.length - usage.current.length} '${usageString.substr(-usage.current.length - 1)}' to end: a tag was left open`;
        if (usage.current)
            throw `from char #${(usageString.length + 1) - usage.current.length} to end '${usage.current}' a literal was found outside a tag.`;
        return usage.tags;
    }
    /**
     * Method responsible for handling tag opens
     * @since 0.0.1
     * @param usage The current usage interim object
     * @param char The character that triggered this function
     */
    static tagOpen(usage, char) {
        if (usage.opened)
            throw `${usage.at}: you may not open a tag inside another tag.`;
        if (usage.current)
            throw `${usage.fromTo}: there can't be a literal outside a tag`;
        usage.opened++;
        usage.openReq = open.indexOf(char);
    }
    /**
     * Method responsible for handling tag closes
     * @since 0.0.1
     * @param usage The current usage interim object
     * @param char The character that triggered this function
     */
    static tagClose(usage, char) {
        const required = close.indexOf(char);
        if (!usage.opened)
            throw `${usage.at}: invalid close tag found`;
        if (usage.openReq !== required)
            throw `${usage.at}: Invalid closure of '${open[usage.openReq]}${usage.current}' with '${close[required]}'`;
        if (!usage.current)
            throw `${usage.at}: empty tag found`;
        usage.opened--;
        if (usage.current === '...') {
            if (usage.openReq)
                throw `${usage.at}: repeat tag cannot be required`;
            if (usage.tags.length < 1)
                throw `${usage.fromTo}: there can't be a repeat at the beginning`;
            usage.tags[usage.tags.length - 1].repeat = true;
            usage.last = true;
        }
        else {
            usage.tags.push(new Tag_1.Tag(usage.current, usage.tags.length + 1, required));
        }
        usage.current = '';
    }
    /**
     * Method responsible for handling tag spacing
     * @since 0.0.1
     * @param usage The current usage interim object
     * @param char The character that triggered this function
     */
    static tagSpace(usage, char) {
        if (char === '\n')
            throw `${usage.at}: there can't be a line break in the usage string`;
        if (usage.opened)
            throw `${usage.at}: spaces aren't allowed inside a tag`;
        if (usage.current)
            throw `${usage.fromTo}: there can't be a literal outside a tag.`;
    }
}
exports.Usage = Usage;
//# sourceMappingURL=Usage.js.map