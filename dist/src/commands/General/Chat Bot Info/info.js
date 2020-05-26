"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            aliases: ['details', 'what'],
            guarded: true,
            description: language => language.get('COMMAND_INFO_DESCRIPTION')
        });
    }
    async run(message) {
        return message.sendLocale('COMMAND_INFO');
    }
}
exports.default = default_1;
//# sourceMappingURL=info.js.map