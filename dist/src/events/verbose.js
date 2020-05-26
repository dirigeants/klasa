"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(log) {
        this.client.console.verbose(log);
    }
    init() {
        if (!this.client.options.consoleEvents.verbose)
            this.disable();
    }
}
exports.default = default_1;
//# sourceMappingURL=verbose.js.map