"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(error) {
        this.client.console.error(error);
    }
    init() {
        if (!this.client.options.consoleEvents.error)
            this.disable();
    }
}
exports.default = default_1;
//# sourceMappingURL=error.js.map