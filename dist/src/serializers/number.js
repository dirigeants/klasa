"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreSerializer extends klasa_1.Serializer {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['integer', 'float'] });
    }
    async validate(data, { entry, language }) {
        let number;
        switch (entry.type) {
            case 'integer':
                number = typeof data === 'number' ? data : parseInt(data);
                if (Number.isInteger(number))
                    return number;
                throw language.get('RESOLVER_INVALID_INT', entry.key);
            case 'number':
            case 'float':
                number = typeof data === 'number' ? data : parseFloat(data);
                if (!Number.isNaN(number))
                    return number;
                throw language.get('RESOLVER_INVALID_FLOAT', entry.key);
        }
        // noop
        return null;
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=number.js.map