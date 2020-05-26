"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['mention'] });
    }
    async run(argument, possible, message) {
        const userID = klasa_1.Argument.regex.userOrMember.exec(argument);
        const user = userID ? await this.client.users.fetch(userID[1]).catch(() => null) : null;
        if (user)
            return user;
        throw message.language.get('RESOLVER_INVALID_USER', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=user.js.map