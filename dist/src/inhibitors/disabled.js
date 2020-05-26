"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Inhibitor {
    run(message, command) {
        if (!command.enabled)
            throw message.language.get('INHIBITOR_DISABLED_GLOBAL');
        if (message.guildSettings.get('disabledCommands').includes(command.name))
            throw message.language.get('INHIBITOR_DISABLED_GUILD');
    }
}
exports.default = default_1;
//# sourceMappingURL=disabled.js.map