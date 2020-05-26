"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['cmd'] });
    }
    run(argument, possible, message) {
        const command = this.client.commands.get(argument.toLowerCase());
        if (command)
            return command;
        throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'command');
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=command.js.map