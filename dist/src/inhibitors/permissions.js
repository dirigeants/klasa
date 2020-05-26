"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Inhibitor {
    async run(message, command) {
        const { broke, permission } = await this.client.permissionLevels.run(message, command.permissionLevel);
        if (!permission)
            throw broke ? message.language.get('INHIBITOR_PERMISSIONS') : true;
    }
}
exports.default = default_1;
//# sourceMappingURL=permissions.js.map