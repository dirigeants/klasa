"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const roleID = klasa_1.Argument.regex.role.exec(argument);
        const role = roleID ? message.guild?.roles.get(roleID[1]) : null;
        if (role)
            return role;
        throw message.language.get('RESOLVER_INVALID_ROLE', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=role.js.map