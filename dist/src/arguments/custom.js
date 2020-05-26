"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    async run(argument, possible, message, custom) {
        try {
            return await custom(argument, possible, message, message.params);
        }
        catch (err) {
            if (err)
                throw err;
            throw message.language.get('RESOLVER_INVALID_CUSTOM', possible.name, possible.type);
        }
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=custom.js.map