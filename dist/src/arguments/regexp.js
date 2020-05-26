"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['reg', 'regex'] });
    }
    run(argument, possible, message) {
        const regex = possible.regex;
        const results = regex.exec(argument);
        if (results)
            return results;
        throw message.language.get('RESOLVER_INVALID_REGEX_MATCH', possible.name, regex.toString());
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=regexp.js.map