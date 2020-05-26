"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const emojiID = klasa_1.Argument.regex.emoji.exec(argument);
        const emoji = emojiID ? this.client.emojis.get(emojiID[1]) : null;
        if (emoji)
            return emoji;
        throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=emoji.js.map