"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(error) {
        this.client.emit('error', `Disconnected | ${error.code}: ${error.reason}`);
    }
}
exports.default = default_1;
//# sourceMappingURL=disconnect.js.map