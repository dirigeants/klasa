"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const date = new Date(argument);
        if (!isNaN(date.getTime()) && date.getTime() > Date.now())
            return date;
        throw message.language.get('RESOLVER_INVALID_DATE', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=date.js.map