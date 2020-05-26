"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizerStore = void 0;
const core_1 = require("@klasa/core");
const Finalizer_1 = require("./Finalizer");
/**
 * Stores all {@link Finalizer} pieces for use in Klasa.
 * @since 0.0.1
 */
class FinalizerStore extends core_1.Store {
    /**
     * Constructs our FinalizerStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'finalizers', Finalizer_1.Finalizer);
    }
    /**
     * Runs all of our finalizers after a command is ran successfully.
     * @since 0.0.1
     * @param message The message that called the command
     * @param command The command this finalizer is for (may be different than message.command)
     * @param responses The responses of the command
     * @param timer The timer run from start to queue of the command
     */
    run(message, command, responses, timer) {
        // eslint-disable-next-line dot-notation
        for (const finalizer of this.values())
            if (finalizer.enabled)
                finalizer['_run'](message, command, responses, timer);
    }
}
exports.FinalizerStore = FinalizerStore;
//# sourceMappingURL=FinalizerStore.js.map