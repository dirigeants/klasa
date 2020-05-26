"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const language = this.client.languages.get(argument);
        if (language)
            return language;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'language');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=language.js.map