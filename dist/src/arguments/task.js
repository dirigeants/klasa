"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const task = this.client.tasks.get(argument);
        if (task)
            return task;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'task');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=task.js.map