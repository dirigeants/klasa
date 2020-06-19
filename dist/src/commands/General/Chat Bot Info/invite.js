"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            guarded: true,
            description: language => language.get('COMMAND_INVITE_DESCRIPTION')
        });
    }
    async run(message) {
        return message.replyLocale('COMMAND_INVITE');
    }
    async init() {
        if (this.client.application && !this.client.application.botPublic)
            this.permissionLevel = 10;
    }
}
exports.default = default_1;
//# sourceMappingURL=invite.js.map