"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const extendable = this.client.extendables.get(argument);
        if (extendable)
            return extendable;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'extendable');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=extendable.js.map