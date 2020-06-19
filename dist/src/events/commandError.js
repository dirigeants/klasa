"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
const discord_md_tags_1 = require("discord-md-tags");
class default_1 extends core_1.Event {
    async run(message, command, _params, error) {
        if (error instanceof Error)
            this.client.emit('wtf', `[COMMAND] ${command.path}\n${error.stack || error}`);
        if (typeof error === 'string')
            await message.reply(mb => mb.setContent(error));
        else
            await message.reply(mb => mb.setContent(discord_md_tags_1.codeblock('JSON') `${error.message}`));
    }
}
exports.default = default_1;
//# sourceMappingURL=commandError.js.map