"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
const stopwatch_1 = require("@klasa/stopwatch");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            aliases: ['r'],
            permissionLevel: 10,
            guarded: true,
            description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
            usage: '<Store:store|Piece:piece|everything:default>'
        });
    }
    async run(message, [piece]) {
        if (piece === 'everything')
            return this.everything(message);
        if (piece instanceof core_1.Store) {
            const timer = new stopwatch_1.Stopwatch();
            await piece.loadAll();
            await piece.init();
            return message.replyLocale('COMMAND_RELOAD_ALL', [piece, timer.stop()]);
        }
        try {
            const item = await piece.reload();
            if (!item)
                throw new Error('Failed to reload.');
            const timer = new stopwatch_1.Stopwatch();
            return message.replyLocale('COMMAND_RELOAD', [item.type, item.name, timer.stop()]);
        }
        catch (err) {
            piece.store.add(piece);
            return message.replyLocale('COMMAND_RELOAD_FAILED', [piece.type, piece.name]);
        }
    }
    async everything(message) {
        const timer = new stopwatch_1.Stopwatch();
        await Promise.all(this.client.pieceStores.map(async (store) => {
            await store.loadAll();
            await store.init();
        }));
        return message.replyLocale('COMMAND_RELOAD_EVERYTHING', [timer.stop()]);
    }
}
exports.default = default_1;
//# sourceMappingURL=reload.js.map