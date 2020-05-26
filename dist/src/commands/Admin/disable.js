"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const discord_md_tags_1 = require("discord-md-tags");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            permissionLevel: 10,
            guarded: true,
            description: language => language.get('COMMAND_DISABLE_DESCRIPTION'),
            usage: '<Piece:piece>'
        });
    }
    async run(message, [piece]) {
        if ((piece.type === 'event' && piece.name === 'coreMessage') ||
            (piece.type === 'monitor' && piece.name === 'commandHandler') ||
            (piece.type === 'action' && piece.name === 'MESSAGE_CREATE')) {
            return message.sendLocale('COMMAND_DISABLE_WARN');
        }
        piece.disable();
        return message.send(mb => mb.setContent(discord_md_tags_1.codeblock('diff') `${message.language.get('COMMAND_DISABLE', [piece.type, piece.name])}`));
    }
}
exports.default = default_1;
//# sourceMappingURL=disable.js.map