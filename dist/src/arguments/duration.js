"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const duration_1 = require("@klasa/duration");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const date = new duration_1.Duration(argument).fromNow;
        if (!isNaN(date.getTime()) && date.getTime() > Date.now())
            return date;
        throw message.language.get('RESOLVER_INVALID_DURATION', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=duration.js.map