"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreSerializer extends klasa_1.Serializer {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['command', 'language'] });
    }
    deserialize(data, { language, entry }) {
        const store = this.client[`${entry.type}s`];
        const parsed = typeof data === 'string' ? store.get(data) : data;
        if (parsed && parsed instanceof store.holds)
            return parsed;
        throw language.get('RESOLVER_INVALID_PIECE', entry.key, entry.type);
    }
    serialize(value) {
        return value.name;
    }
    stringify(value) {
        return value.name;
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=piece.js.map