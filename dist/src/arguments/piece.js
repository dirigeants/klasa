"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        for (const store of this.client.pieceStores.values()) {
            const piece = store.get(argument);
            if (piece)
                return piece;
        }
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'piece');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=piece.js.map