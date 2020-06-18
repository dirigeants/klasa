"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    async run(argument, possible, message) {
        var _a;
        const memberID = klasa_1.Argument.regex.userOrMember.exec(argument);
        const member = memberID ? await ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(memberID[1]).catch(() => null)) : null;
        if (member)
            return member;
        throw message.language.get('RESOLVER_INVALID_MEMBER', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=member.js.map