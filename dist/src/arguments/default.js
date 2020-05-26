"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const literal = possible.name.toLowerCase();
        if (typeof argument === 'undefined' || argument.toLowerCase() !== literal)
            message.args.splice(message.params.length, 0, undefined);
        return literal;
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=default.js.map