"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(failure) {
        this.client.console.wtf(failure);
    }
    init() {
        if (!this.client.options.consoleEvents.wtf)
            this.disable();
    }
}
exports.default = default_1;
//# sourceMappingURL=wtf.js.map