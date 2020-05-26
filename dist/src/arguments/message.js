"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['msg'] });
    }
    async run(argument, possible, message) {
        const msg = klasa_1.Argument.regex.snowflake.test(argument) ? await message.channel.messages.fetch(argument).catch(() => null) : undefined;
        if (msg)
            return msg;
        throw message.language.get('RESOLVER_INVALID_MESSAGE', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=message.js.map