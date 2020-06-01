"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
class CoreSerializer extends klasa_1.Serializer {
    async validate(data, { entry, language }) {
        if (data instanceof core_1.Guild)
            return data;
        const guild = klasa_1.Serializer.regex.snowflake.test(data) ? this.client.guilds.get(data) : null;
        if (guild)
            return guild;
        throw language.get('RESOLVER_INVALID_GUILD', entry.key);
    }
    serialize(value) {
        return value.id;
    }
    stringify(value) {
        return value.name;
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=guild.js.map