"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Inhibitor {
    run(message, command) {
        if (!command.runIn.length)
            throw message.language.get('INHIBITOR_RUNIN_NONE', command.name);
        if (!command.runIn.includes(message.channel.type))
            throw message.language.get('INHIBITOR_RUNIN', command.runIn.join(', '));
    }
}
exports.default = default_1;
//# sourceMappingURL=runIn.js.map