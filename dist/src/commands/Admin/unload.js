"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            aliases: ['u'],
            permissionLevel: 10,
            guarded: true,
            description: language => language.get('COMMAND_UNLOAD_DESCRIPTION'),
            usage: '<Piece:piece>'
        });
    }
    async run(message, [piece]) {
        if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
            return message.replyLocale('COMMAND_UNLOAD_WARN');
        }
        piece.unload();
        return message.replyLocale('COMMAND_UNLOAD', [piece.type, piece.name]);
    }
}
exports.default = default_1;
//# sourceMappingURL=unload.js.map