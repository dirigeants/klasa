"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            permissionLevel: 10,
            guarded: true,
            description: language => language.get('COMMAND_REBOOT_DESCRIPTION')
        });
    }
    async run(message) {
        await message.sendLocale('COMMAND_REBOOT').catch(err => this.client.emit('error', err));
        await Promise.all(this.client.providers.map(provider => provider.shutdown()));
        process.exit();
    }
}
exports.default = default_1;
//# sourceMappingURL=reboot.js.map