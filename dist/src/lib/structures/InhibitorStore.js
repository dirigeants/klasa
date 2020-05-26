"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InhibitorStore = void 0;
const Inhibitor_1 = require("./Inhibitor");
const core_1 = require("@klasa/core");
/**
 * Stores all {@link Inhibitor} pieces for use in Klasa
 */
class InhibitorStore extends core_1.Store {
    /**
     * Constructs our InhibitorStore for use in Klasa.
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'inhibitors', Inhibitor_1.Inhibitor);
    }
    /**
     * Runs our inhibitors on the command.
     * @since 0.0.1
     * @param message The message object from @klasa/core
     * @param command The command being ran.
     * @param selective Whether or not we should ignore certain inhibitors to prevent spam.
     */
    async run(message, command, selective = false) {
        const mps = [];
        // eslint-disable-next-line dot-notation
        for (const inhibitor of this.values())
            if (inhibitor.enabled && (!selective || !inhibitor.spamProtection))
                mps.push(inhibitor['_run'](message, command));
        const results = (await Promise.all(mps)).filter(res => res);
        if (results.includes(true))
            throw undefined;
        if (results.length)
            throw results;
    }
}
exports.InhibitorStore = InhibitorStore;
//# sourceMappingURL=InhibitorStore.js.map