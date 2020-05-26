"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const truths = ['1', 'true', '+', 't', 'yes', 'y'];
const falses = ['0', 'false', '-', 'f', 'no', 'n'];
class CoreSerializer extends klasa_1.Serializer {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['bool'] });
    }
    deserialize(data, { language, entry }) {
        const boolean = String(data).toLowerCase();
        if (truths.includes(boolean))
            return true;
        if (falses.includes(boolean))
            return false;
        throw language.get('RESOLVER_INVALID_BOOL', entry.key);
    }
    stringify(value) {
        return value ? 'Enabled' : 'Disabled';
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=boolean.js.map