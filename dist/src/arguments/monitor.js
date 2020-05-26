"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const monitor = this.client.monitors.get(argument);
        if (monitor)
            return monitor;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'monitor');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=monitor.js.map