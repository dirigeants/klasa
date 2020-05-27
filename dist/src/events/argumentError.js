"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(message, _argument, _params, error) {
        message.send(mb => mb.setContent(error)).catch(err => this.client.emit('wtf', err));
    }
}
exports.default = default_1;
//# sourceMappingURL=argumentError.js.map