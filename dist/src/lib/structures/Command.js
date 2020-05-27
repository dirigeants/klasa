"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
const Usage_1 = require("../usage/Usage");
const CommandUsage_1 = require("../usage/CommandUsage");
/**
 * Base class for all Klasa Commands. See {@tutorial CreatingCommands} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingCommands
 */
class Command extends core_1.AliasPiece {
    /**
     * @since 0.0.1
     * @param store The Command store
     * @param directory The base directory to the pieces folder
     * @param file The path from the pieces folder to the command file
     * @param options Optional Command settings
     */
    constructor(store, directory, files, options = {}) {
        super(store, directory, files, options);
        options = options;
        this.name = this.name.toLowerCase();
        if (options.autoAliases) {
            if (this.name.includes('-'))
                this.aliases.push(this.name.replace(/-/g, ''));
            for (const alias of this.aliases)
                if (alias.includes('-'))
                    this.aliases.push(alias.replace(/-/g, ''));
        }
        this.requiredPermissions = new core_1.Permissions(options.requiredPermissions).freeze();
        this.deletable = options.deletable;
        this.description = (utils_1.isFunction(options.description) ?
            (language = this.client.languages.default) => options.description(language) :
            options.description);
        this.extendedHelp = (utils_1.isFunction(options.extendedHelp) ?
            (language = this.client.languages.default) => options.extendedHelp(language) :
            options.extendedHelp);
        this.fullCategory = files.slice(0, -1);
        this.guarded = options.guarded;
        this.hidden = options.hidden;
        this.nsfw = options.nsfw;
        this.permissionLevel = options.permissionLevel;
        this.promptLimit = options.promptLimit;
        this.promptTime = options.promptTime;
        this.flagSupport = options.flagSupport;
        this.quotedStringSupport = options.quotedStringSupport;
        this.requiredSettings = options.requiredSettings;
        this.runIn = options.runIn;
        this.subcommands = options.subcommands;
        this.usage = new CommandUsage_1.CommandUsage(this.client, options.usage, options.usageDelim, this);
        this.cooldownLevel = options.cooldownLevel;
        if (!['author', 'channel', 'guild'].includes(this.cooldownLevel))
            throw new Error('Invalid cooldownLevel');
        this.bucket = options.bucket;
        this.cooldown = options.cooldown;
    }
    /**
     * The main category for the command
     * @since 0.0.1
     * @readonly
     */
    get category() {
        return this.fullCategory[0] || 'General';
    }
    /**
     * The sub category for the command
     * @since 0.0.1
     * @readonly
     */
    get subCategory() {
        return this.fullCategory[1] || 'General';
    }
    /**
     * The usage deliminator for the command input
     * @since 0.0.1
     * @readonly
     */
    get usageDelim() {
        return this.usage.usageDelim;
    }
    /**
     * The usage string for the command
     * @since 0.0.1
     * @readonly
     */
    get usageString() {
        return this.usage.usageString;
    }
    /**
     * Creates a Usage to run custom prompts off of
     * @param {string} usageString The string designating all parameters expected
     * @param {string} usageDelim The string to delimit the input
     * @returns {Usage}
     */
    definePrompt(usageString, usageDelim) {
        return new Usage_1.Usage(this.client, usageString, usageDelim);
    }
    /**
     * Registers a one-off custom resolver. See tutorial {@link CommandsCustomResolvers}
     * @since 0.5.0
     * @param {string} type The type of the usage argument
     * @param {Function} resolver The one-off custom resolver
     * @chainable
     */
    createCustomResolver(type, resolver) {
        this.usage.createCustomResolver(type, resolver);
        return this;
    }
    /**
     * Customizes the response of an argument if it fails resolution. See tutorial {@link CommandsCustomResponses}
     * @since 0.5.0
     * @param {string} name The name of the usage argument
     * @param {(string|Function)} response The custom response or i18n function
     * @chainable
     * @example
     * // Changing the message for a parameter called 'targetUser'
     * this.customizeResponse('targetUser', 'You did not give me a user...');
     *
     * // Or also using functions to have multilingual support:
     * this.customizeResponse('targetUser', (message) =>
     *     message.language.get('COMMAND_REQUIRED_USER_FRIENDLY'));
     */
    customizeResponse(name, response) {
        this.usage.customizeResponse(name, response);
        return this;
    }
    /**
     * Defines the JSON.stringify behavior of this command.
     * @returns {Object}
     */
    toJSON() {
        return {
            ...super.toJSON(),
            requiredPermissions: this.requiredPermissions.toArray(),
            bucket: this.bucket,
            category: this.category,
            cooldown: this.cooldown,
            deletable: this.deletable,
            description: utils_1.isFunction(this.description) ? this.description(this.client.languages.default) : this.description,
            extendedHelp: utils_1.isFunction(this.extendedHelp) ? this.extendedHelp(this.client.languages.default) : this.extendedHelp,
            fullCategory: this.fullCategory,
            guarded: this.guarded,
            hidden: this.hidden,
            nsfw: this.nsfw,
            permissionLevel: this.permissionLevel,
            promptLimit: this.promptLimit,
            promptTime: this.promptTime,
            quotedStringSupport: this.quotedStringSupport,
            requiredSettings: this.requiredSettings.slice(0),
            runIn: this.runIn.slice(0),
            subCategory: this.subCategory,
            subcommands: this.subcommands,
            usage: {
                usageString: this.usage.usageString,
                usageDelim: this.usage.usageDelim,
                nearlyFullUsage: this.usage.nearlyFullUsage
            },
            usageDelim: this.usageDelim,
            usageString: this.usageString
        };
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map