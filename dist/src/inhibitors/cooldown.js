"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Inhibitor {
    constructor(store, directory, files) {
        super(store, directory, files, { spamProtection: true });
    }
    run(message, command) {
        if (this.client.owners.has(message.author) || command.cooldown <= 0)
            return;
        let existing;
        try {
            existing = this.client.finalizers.get('commandCooldown').getCooldown(message, command);
        }
        catch (err) {
            return;
        }
        if (existing && existing.limited)
            throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(existing.remainingTime / 1000), command.cooldownLevel !== 'author');
    }
}
exports.default = default_1;
//# sourceMappingURL=cooldown.js.map