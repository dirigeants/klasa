"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const guild = klasa_1.Argument.regex.snowflake.test(argument) ? this.client.guilds.get(argument) : null;
        if (guild)
            return guild;
        throw message.language.get('RESOLVER_INVALID_GUILD', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=guild.js.map