"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    run(_scheduledTask, task, error) {
        this.client.emit('wtf', `[TASK] ${task.path}\n${error ?
            error.stack ? error.stack : error : 'Unknown error'}`);
    }
}
exports.default = default_1;
//# sourceMappingURL=taskError.js.map