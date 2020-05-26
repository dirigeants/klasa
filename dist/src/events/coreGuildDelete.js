"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    constructor(store, directory, file) {
        super(store, directory, file, { event: 'guildDelete' });
    }
    run(guild) {
        if (!guild.unavailable && !this.client.options.settings.preserve)
            guild.settings.destroy().catch(() => null);
    }
}
exports.default = default_1;
//# sourceMappingURL=coreGuildDelete.js.map