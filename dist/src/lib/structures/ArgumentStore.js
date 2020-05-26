"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentStore = void 0;
const core_1 = require("@klasa/core");
const Argument_1 = require("./Argument");
/**
 * Stores all {@link Argument} pieces for use in Klasa.
 * @since 0.0.1
 */
class ArgumentStore extends core_1.AliasStore {
    /**
     * Constructs our ArgumentStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'arguments', Argument_1.Argument);
    }
}
exports.ArgumentStore = ArgumentStore;
//# sourceMappingURL=ArgumentStore.js.map