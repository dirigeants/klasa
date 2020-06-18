"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPrompt = void 0;
const TextPrompt_1 = require("./TextPrompt");
/**
 * A class to handle argument collection and parameter resolution for commands
 * @extends TextPrompt
 */
class CommandPrompt extends TextPrompt_1.TextPrompt {
    /**
     * @since 0.5.0
     * @param message The message for the command
     * @param usage The usage of the command
     * @param options The options for this CommandPrompt
     */
    constructor(message, usage, options = {}) {
        var _a;
        super(message, usage, options);
        this.typing = this.client.options.commands.typing;
        // eslint-disable-next-line dot-notation
        this['_setup'](this.message.content.slice((_a = this.message.prefixLength) !== null && _a !== void 0 ? _a : undefined).trim().split(' ').slice(1).join(' ').trim());
    }
    /**
     * Runs the internal validation, and re-prompts according to the settings
     * @since 0.5.0
     * @returns The parameters resolved
     */
    run() {
        return this.validateArgs();
    }
}
exports.CommandPrompt = CommandPrompt;
//# sourceMappingURL=CommandPrompt.js.map