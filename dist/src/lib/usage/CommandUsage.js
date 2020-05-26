"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandUsage = void 0;
const Usage_1 = require("./Usage");
const CommandPrompt_1 = require("./CommandPrompt");
/**
 * Converts usage strings into objects to compare against later
 */
class CommandUsage extends Usage_1.Usage {
    /**
     * @since 0.0.1
     * @param client The klasa client
     * @param usageString The usage string for this command
     * @param usageDelim The usage deliminator for this command
     * @param command The command this parsed usage is for
     */
    constructor(client, usageString, usageDelim, command) {
        super(client, usageString, usageDelim);
        this.names = [command.name, ...command.aliases];
        this.commands = this.names.length === 1 ? this.names[0] : `《${this.names.join('|')}》`;
        this.nearlyFullUsage = `${this.commands}${this.deliminatedUsage}`;
    }
    /**
     * Creates a CommandPrompt instance to collect and resolve arguments with
     * @since 0.5.0
     * @param message The message context from the prompt
     * @param options The options for the prompt
     */
    createPrompt(message, options = {}) {
        return new CommandPrompt_1.CommandPrompt(message, this, options);
    }
    /**
     * Creates a full usage string including prefix and commands/aliases for documentation/help purposes
     * @since 0.0.1
     * @param message The message context for which to generate usage for
     */
    fullUsage(message) {
        let prefix = message.prefixLength ? message.content.slice(0, message.prefixLength) : message.guildSettings.get('prefix');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (message.prefix === this.client.mentionPrefix)
            prefix = `@${this.client.user.tag}`;
        else if (Array.isArray(prefix))
            [prefix] = prefix;
        return `${prefix.length !== 1 ? `${prefix} ` : prefix}${this.nearlyFullUsage}`;
    }
    /**
     * Defines to string behavior of this class.
     * @since 0.5.0
     */
    toString() {
        return this.nearlyFullUsage;
    }
}
exports.CommandUsage = CommandUsage;
//# sourceMappingURL=CommandUsage.js.map