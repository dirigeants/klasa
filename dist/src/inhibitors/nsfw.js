"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
require("@klasa/dapi-types");
class default_1 extends klasa_1.Inhibitor {
    run(message, command) {
        if (command.nsfw && message.channel.type !== 1 /* DM */ && !message.channel.nsfw)
            throw message.language.get('INHIBITOR_NSFW');
    }
}
exports.default = default_1;
//# sourceMappingURL=nsfw.js.map