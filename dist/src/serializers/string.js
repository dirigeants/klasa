"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreSerializer extends klasa_1.Serializer {
    async validate(data) {
        return String(data);
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=string.js.map