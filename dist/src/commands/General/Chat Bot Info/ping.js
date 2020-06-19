"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            guarded: true,
            description: language => language.get('COMMAND_PING_DESCRIPTION')
        });
    }
    async run(message) {
        const [msg] = await message.replyLocale('COMMAND_PING');
        return message.replyLocale('COMMAND_PINGPONG', [(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp), Math.round(this.client.ws.ping)]);
    }
}
exports.default = default_1;
//# sourceMappingURL=ping.js.map