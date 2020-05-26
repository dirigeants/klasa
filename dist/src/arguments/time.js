"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    get date() {
        return this.store.get('date');
    }
    get duration() {
        return this.store.get('duration');
    }
    run(argument, possible, message, custom) {
        let date;
        try {
            date = this.date.run(argument, possible, message, custom);
        }
        catch (err) {
            try {
                date = this.duration.run(argument, possible, message, custom);
            }
            catch (error) {
                // noop
            }
        }
        if (date && !Number.isNaN(date.getTime()) && date.getTime() > Date.now())
            return date;
        throw message.language.get('RESOLVER_INVALID_TIME', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=time.js.map