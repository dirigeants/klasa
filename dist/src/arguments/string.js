"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['str'] });
    }
    run(argument, possible, message) {
        if (!argument)
            throw message.language.get('RESOLVER_INVALID_STRING', possible.name);
        const { min, max } = possible;
        return klasa_1.Argument.minOrMax(this.client, argument.length, min, max, possible, message, 'RESOLVER_STRING_SUFFIX') ? argument : null;
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=string.js.map