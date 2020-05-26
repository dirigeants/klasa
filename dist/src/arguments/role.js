"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        var _a;
        const roleID = klasa_1.Argument.regex.role.exec(argument);
        const role = roleID ? (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.get(roleID[1]) : null;
        if (role)
            return role;
        throw message.language.get('RESOLVER_INVALID_ROLE', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=role.js.map