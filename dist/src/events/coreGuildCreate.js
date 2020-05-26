"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@klasa/core");
class default_1 extends core_1.Event {
    constructor(store, directory, file) {
        super(store, directory, file, { event: 'guildCreate' });
    }
    run(guild) {
        if (guild.unavailable)
            return;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.client.settings.get('guildBlacklist').includes(guild.id)) {
            guild.leave();
            this.client.emit('warn', `Blacklisted guild detected: ${guild.name} [${guild.id}]`);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=coreGuildCreate.js.map