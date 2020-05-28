"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorStore = void 0;
const core_1 = require("@klasa/core");
const Monitor_1 = require("./Monitor");
/**
 * Stores all {@link Monitor} pieces for use in Klasa.
 * @since 0.0.1
 */
class MonitorStore extends core_1.Store {
    /**
     * Constructs our MonitorStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'monitors', Monitor_1.Monitor);
    }
    /**
     * Runs our monitors on the message.
     * @since 0.0.1
     * @param message The message to be used in the {@link Monitor monitors}.
     */
    run(message) {
        // eslint-disable-next-line dot-notation
        for (const monitor of this.values())
            if (monitor.shouldRun(message))
                monitor['_run'](message);
    }
}
exports.MonitorStore = MonitorStore;
//# sourceMappingURL=MonitorStore.js.map