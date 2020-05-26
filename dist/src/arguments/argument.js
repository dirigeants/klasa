"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const entry = this.client.arguments.get(argument);
        if (entry)
            return entry;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'argument');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=argument.js.map