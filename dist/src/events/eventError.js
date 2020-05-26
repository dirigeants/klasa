"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(event, _args, error) {
        this.client.emit('wtf', `[EVENT] ${event.path}\n${error ?
            error.stack ? error.stack : error : 'Unknown error'}`);
    }
}
exports.default = default_1;
//# sourceMappingURL=eventError.js.map