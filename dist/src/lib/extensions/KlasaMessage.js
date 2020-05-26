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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlasaMessage = void 0;
/* eslint-disable no-dupe-class-members */
const core_1 = require("@klasa/core");
const cache_1 = require("@klasa/cache");
const utils_1 = require("@klasa/utils");
/**
 * Klasa's Extended Message
 */
let KlasaMessage = /** @class */ (() => {
    var _responses;
    class KlasaMessage extends core_1.extender.get('Message') {
        constructor(...args) {
            super(...args);
            /**
             * All of the responses to this message.
             */
            _responses.set(this, void 0);
            this.command = this.command || null;
            this.commandText = this.commandText || null;
            this.prefix = this.prefix || null;
            this.prefixLength = this.prefixLength || null;
            this.guildSettings = this.guild ? this.guild.settings : this.client.gateways.get('guilds').schema.defaults;
            this.prompter = this.prompter || null;
            __classPrivateFieldSet(this, _responses, []);
        }
        /**
        * The previous responses to this message
        * @since 0.5.0
        */
        get responses() {
            return __classPrivateFieldGet(this, _responses).filter(msg => !msg.deleted);
        }
        /**
        * The string arguments derived from the usageDelim of the command
        * @since 0.0.1
        */
        get args() {
            return this.prompter ? this.prompter.args : [];
        }
        /**
        * The parameters resolved by this class
        * @since 0.0.1
        */
        get params() {
            return this.prompter ? this.prompter.params : [];
        }
        /**
        * The flags resolved by this class
        * @since 0.5.0
        */
        get flagArgs() {
            return this.prompter ? this.prompter.flags : {};
        }
        /**
        * If the command reprompted for missing args
        * @since 0.0.1
        */
        get reprompted() {
            return this.prompter ? this.prompter.reprompted : false;
        }
        /**
        * The usable commands by the author in this message's context
        * @since 0.0.1
        */
        async usableCommands() {
            const col = new cache_1.Cache();
            await Promise.all(this.client.commands.map((command) => this.client.inhibitors.run(this, command, true)
                .then(() => { col.set(command.name, command); })
                .catch(() => {
                // noop
            })));
            return col;
        }
        /**
        * Checks if the author of this message, has applicable permission in this message's context of at least min
        * @since 0.0.1
        */
        async hasAtLeastPermissionLevel(min) {
            const { permission } = await this.client.permissionLevels.run(this, min);
            return permission;
        }
        async send(data, options = {}) {
            const split = (typeof data === 'function' ? await data(new core_1.MessageBuilder()) : new core_1.MessageBuilder(data)).split(options);
            const { responses } = this;
            const promises = [];
            const deletes = [];
            const max = Math.max(split.length, responses.length);
            for (let i = 0; i < max; i++) {
                if (i >= split.length)
                    deletes.push(responses[i].delete());
                else if (responses.length > i)
                    promises.push(responses[i].edit(split[i]));
                else
                    promises.push(this.channel.send(split[i]).then(([message]) => message));
            }
            __classPrivateFieldSet(this, _responses, await Promise.all(promises));
            await Promise.all(deletes);
            return __classPrivateFieldGet(this, _responses).slice(0);
        }
        sendLocale(key, localeArgs = [], options) {
            if (!Array.isArray(localeArgs))
                [options, localeArgs] = [localeArgs, []];
            return this.send(mb => mb.setContent(this.language.get(key, ...localeArgs)), options);
        }
        /**
         * Extends the patch method from Message to attach and update the language to this instance
         * @since 0.5.0
         */
        _patch(data) {
            super._patch(data);
            this.language = this.guild ? this.guild.language : this.client.languages.default;
            this._parseCommand();
            return this;
        }
        /**
        * Parses this message as a command
        * @since 0.5.0
        */
        _parseCommand() {
            // Clear existing command state so edits to non-commands do not re-run commands
            this.prefix = null;
            this.prefixLength = null;
            this.commandText = null;
            this.command = null;
            this.prompter = null;
            try {
                const prefix = this._mentionPrefix() || this._customPrefix() || this._naturalPrefix() || this._prefixLess();
                if (!prefix)
                    return;
                this.prefix = prefix.regex;
                this.prefixLength = prefix.length;
                this.commandText = this.content.slice(prefix.length).trim().split(' ')[0].toLowerCase();
                this.command = this.client.commands.get(this.commandText) || null;
                if (!this.command)
                    return;
                this.prompter = this.command.usage.createPrompt(this, {
                    flagSupport: this.command.flagSupport,
                    quotedStringSupport: this.command.quotedStringSupport,
                    time: this.command.promptTime,
                    limit: this.command.promptLimit
                });
            }
            catch (error) {
                return;
            }
        }
        /**
        * Checks if the per-guild or default prefix is used
        * @since 0.5.0
        */
        _customPrefix() {
            const prefix = this.guildSettings.get('prefix');
            if (!prefix)
                return null;
            for (const prf of Array.isArray(prefix) ? prefix : [prefix]) {
                const testingPrefix = KlasaMessage.prefixes.get(prf) || KlasaMessage.generateNewPrefix(prf, this.client.options.commands.prefixCaseInsensitive ? 'i' : '');
                if (testingPrefix.regex.test(this.content))
                    return testingPrefix;
            }
            return null;
        }
        /**
        * Checks if the mention was used as a prefix
        * @since 0.5.0
        */
        _mentionPrefix() {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const mentionPrefix = this.client.mentionPrefix.exec(this.content);
            return mentionPrefix ? { length: mentionPrefix[0].length, regex: this.client.mentionPrefix } : null;
        }
        /**
        * Checks if the natural prefix is used
        * @since 0.5.0
        */
        _naturalPrefix() {
            if (this.guildSettings.get('disableNaturalPrefix') || !this.client.options.commands.regexPrefix)
                return null;
            const results = this.client.options.commands.regexPrefix.exec(this.content);
            return results ? { length: results[0].length, regex: this.client.options.commands.regexPrefix } : null;
        }
        /**
        * Checks if a prefixless scenario is possible
        * @since 0.5.0
        */
        _prefixLess() {
            return this.client.options.commands.noPrefixDM && this.channel.type === 1 /* DM */ ? { length: 0, regex: null } : null;
        }
        /**
        * Caches a new prefix regexp
        * @since 0.5.0
        */
        static generateNewPrefix(prefix, flags) {
            const prefixObject = { length: prefix.length, regex: new RegExp(`^${utils_1.regExpEsc(prefix)}`, flags) };
            this.prefixes.set(prefix, prefixObject);
            return prefixObject;
        }
    }
    _responses = new WeakMap();
    /**
    * Cache of RegExp prefixes
    * @since 0.5.0
    */
    KlasaMessage.prefixes = new Map();
    return KlasaMessage;
})();
exports.KlasaMessage = KlasaMessage;
core_1.extender.extend('Message', () => KlasaMessage);
//# sourceMappingURL=KlasaMessage.js.map