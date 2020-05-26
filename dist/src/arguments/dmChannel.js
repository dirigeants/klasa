"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    async run(argument, possible, message) {
        const userID = klasa_1.Argument.regex.userOrMember.exec(argument);
        const user = userID ? await this.client.users.fetch(userID[1]).catch(() => null) : null;
        if (user)
            return user.openDM();
        throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=dmChannel.js.map