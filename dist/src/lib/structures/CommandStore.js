"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandStore = void 0;
const Command_1 = require("./Command");
const core_1 = require("@klasa/core");
/**
 * Stores all {@link Command} pieces for use in Klasa.
 * @since 0.0.1
 */
class CommandStore extends core_1.AliasStore {
    /**
     * Constructs our CommandStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'commands', Command_1.Command);
    }
}
exports.CommandStore = CommandStore;
//# sourceMappingURL=CommandStore.js.map