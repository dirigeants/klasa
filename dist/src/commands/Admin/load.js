"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const stopwatch_1 = require("@klasa/stopwatch");
const fs_nextra_1 = require("fs-nextra");
const path_1 = require("path");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            aliases: ['l'],
            permissionLevel: 10,
            guarded: true,
            description: language => language.get('COMMAND_LOAD_DESCRIPTION'),
            usage: '[core] <Store:store> <path:...string>',
            usageDelim: ' '
        });
        this.regExp = /\\\\?|\//g;
    }
    async run(message, [core, store, rawPath]) {
        const path = (rawPath.endsWith('.js') ? rawPath : `${rawPath}.js`).split(this.regExp);
        const timer = new stopwatch_1.Stopwatch();
        const piece = await (core ? this.tryEach(store, path) : store.load(store.userDirectory, path));
        try {
            if (!piece)
                throw message.language.get('COMMAND_LOAD_FAIL');
            await piece.init();
            return message.replyLocale('COMMAND_LOAD', [timer.stop(), store.name, piece.name]);
        }
        catch (error) {
            timer.stop();
            throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
        }
    }
    async tryEach(store, path) {
        // eslint-disable-next-line dot-notation
        for (const dir of store['coreDirectories'])
            if (await fs_nextra_1.pathExists(path_1.join(dir, ...path)))
                return store.load(dir, path);
        return undefined;
    }
}
exports.default = default_1;
//# sourceMappingURL=load.js.map