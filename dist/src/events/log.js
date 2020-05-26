"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(data) {
        this.client.console.log(data);
    }
    init() {
        if (!this.client.options.consoleEvents.log)
            this.disable();
    }
}
exports.default = default_1;
//# sourceMappingURL=log.js.map