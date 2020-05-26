"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const provider = this.client.providers.get(argument);
        if (provider)
            return provider;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'provider');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=provider.js.map