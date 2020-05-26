"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class default_1 extends klasa_1.Inhibitor {
    run(message, command) {
        if (!command.requiredSettings.length || message.channel.type !== 0 /* GuildText */)
            return;
        // eslint-disable-next-line eqeqeq, @typescript-eslint/no-non-null-assertion
        const requiredSettings = command.requiredSettings.filter(setting => message.guild.settings.get(setting) == null);
        if (requiredSettings.length)
            throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', requiredSettings);
    }
}
exports.default = default_1;
//# sourceMappingURL=requiredSettings.js.map