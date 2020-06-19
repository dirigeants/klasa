"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
const duration_1 = require("@klasa/duration");
const discord_md_tags_1 = require("discord-md-tags");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            guarded: true,
            description: language => language.get('COMMAND_STATS_DESCRIPTION')
        });
    }
    async run(message) {
        return message.reply(mb => mb
            .setContent(discord_md_tags_1.codeblock('asciidoc') `${message.language.get('COMMAND_STATS', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), duration_1.Duration.toNow(Date.now() - (process.uptime() * 1000)), this.client.users.size.toLocaleString(), this.client.guilds.size.toLocaleString(), this.client.channels.size.toLocaleString(), klasa_1.version, core_1.version, process.version, message)}`));
    }
}
exports.default = default_1;
//# sourceMappingURL=stats.js.map