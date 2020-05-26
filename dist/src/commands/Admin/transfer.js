"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const fs_nextra_1 = require("fs-nextra");
const fs_1 = require("fs");
const path_1 = require("path");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            permissionLevel: 10,
            guarded: true,
            description: language => language.get('COMMAND_TRANSFER_DESCRIPTION'),
            usage: '<Piece:piece>'
        });
    }
    async run(message, [piece]) {
        const file = path_1.join(...piece.file);
        const fileLocation = path_1.resolve(piece.directory, file);
        await fs_1.promises.access(fileLocation).catch(() => { throw message.language.get('COMMAND_TRANSFER_ERROR'); });
        try {
            await fs_nextra_1.copy(fileLocation, path_1.join(piece.store.userDirectory, file));
            piece.store.load(piece.store.userDirectory, piece.file);
            return message.sendLocale('COMMAND_TRANSFER_SUCCESS', [piece.type, piece.name]);
        }
        catch (err) {
            this.client.emit('error', err.stack);
            return message.sendLocale('COMMAND_TRANSFER_FAILED', [piece.type, piece.name]);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=transfer.js.map