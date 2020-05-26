"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(message, _command, response) {
        if (response && response.length)
            message.send(mb => mb.setContent(response));
    }
}
exports.default = default_1;
//# sourceMappingURL=commandInhibited.js.map