"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    async run(message, _argument, _params, error) {
        await message.reply(mb => mb.setContent(error));
    }
}
exports.default = default_1;
//# sourceMappingURL=argumentError.js.map