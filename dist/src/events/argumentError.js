"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
const discord_md_tags_1 = require("discord-md-tags");
class default_1 extends core_1.Event {
    run(message, argument, _params, error) {
        this.client.emit('wtf', `[ARGUMENT] ${argument.path}\n${error.stack || error}`);
        message.send(mb => mb.setContent(discord_md_tags_1.codeblock('JSON') `${error.message}`)).catch(err => this.client.emit('wtf', err));
    }
}
exports.default = default_1;
//# sourceMappingURL=argumentError.js.map