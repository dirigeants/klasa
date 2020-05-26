"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const inhibitor = this.client.inhibitors.get(argument);
        if (inhibitor)
            return inhibitor;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'inhibitor');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=inhibitor.js.map