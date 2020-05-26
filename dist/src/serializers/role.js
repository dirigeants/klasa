"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
class CoreSerializer extends klasa_1.Serializer {
    deserialize(data, { language, entry, guild }) {
        if (!guild)
            throw this.client.languages.default.get('RESOLVER_INVALID_GUILD', entry.key);
        if (data instanceof core_1.Role)
            return data;
        const parsed = klasa_1.Serializer.regex.role.exec(data);
        const role = parsed ? guild.roles.get(parsed[1]) : guild.roles.findValue(value => value.name === data) || null;
        if (role)
            return role;
        throw language.get('RESOLVER_INVALID_ROLE', entry.key);
    }
    serialize(value) {
        return value.id;
    }
    stringify(value) {
        return value.name;
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=role.js.map