"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const truths = ['1', 'true', '+', 't', 'yes', 'y'];
const falses = ['0', 'false', '-', 'f', 'no', 'n'];
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['bool'] });
    }
    run(argument, possible, message) {
        const boolean = String(argument).toLowerCase();
        if (truths.includes(boolean))
            return true;
        if (falses.includes(boolean))
            return false;
        throw message.language.get('RESOLVER_INVALID_BOOL', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=boolean.js.map