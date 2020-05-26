"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const finalizer = this.client.finalizers.get(argument);
        if (finalizer)
            return finalizer;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'finalizer');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=finalizer.js.map