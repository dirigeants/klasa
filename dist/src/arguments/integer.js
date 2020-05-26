"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['int'] });
    }
    run(argument, possible, message) {
        const { min, max } = possible;
        const number = parseInt(argument);
        if (!Number.isInteger(number))
            throw message.language.get('RESOLVER_INVALID_INT', possible.name);
        return klasa_1.Argument.minOrMax(this.client, number, min, max, possible, message) ? number : null;
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=integer.js.map