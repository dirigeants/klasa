"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const url_1 = require("url");
class CoreSerializer extends klasa_1.Serializer {
    deserialize(data, { language, entry }) {
        const url = data instanceof url_1.URL ? data : new url_1.URL(data);
        if (url.protocol && url.hostname)
            return url.href;
        throw language.get('RESOLVER_INVALID_URL', entry.key);
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=url.js.map