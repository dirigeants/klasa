"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Inhibitor {
    run(message, command) {
        return command.hidden && message.command !== command && !this.client.owners.has(message.author);
    }
}
exports.default = default_1;
//# sourceMappingURL=hidden.js.map