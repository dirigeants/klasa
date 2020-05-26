"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['url'] });
    }
    run(argument, possible, message) {
        const res = url_1.parse(argument);
        const hyperlink = res.protocol && res.hostname ? argument : null;
        if (hyperlink !== null)
            return hyperlink;
        throw message.language.get('RESOLVER_INVALID_URL', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=hyperlink.js.map