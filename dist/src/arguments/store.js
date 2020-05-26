"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const store = this.client.pieceStores.get(argument);
        if (store)
            return store;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'store');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=store.js.map