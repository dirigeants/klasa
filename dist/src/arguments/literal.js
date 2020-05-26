"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        if (argument.toLowerCase() === possible.name.toLowerCase())
            return possible.name;
        throw message.language.get('RESOLVER_INVALID_LITERAL', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=literal.js.map