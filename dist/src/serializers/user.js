"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreSerializer extends klasa_1.Serializer {
    async deserialize(data, { language, entry }) {
        let user = this.client.users.resolve(data);
        if (user)
            return user;
        const resolved = klasa_1.Serializer.regex.userOrMember.exec(data);
        if (resolved)
            user = await this.client.users.fetch(resolved[1]).catch(() => null);
        if (user)
            return user;
        throw language.get('RESOLVER_INVALID_USER', entry.key);
    }
    serialize(value) {
        return value.id;
    }
    stringify(value) {
        return value.tag;
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=user.js.map