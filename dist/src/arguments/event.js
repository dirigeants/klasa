"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    run(argument, possible, message) {
        const event = this.client.events.get(argument);
        if (event)
            return event;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'event');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=event.js.map