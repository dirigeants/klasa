"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            permissionLevel: 10,
            description: language => language.get('COMMAND_BLACKLIST_DESCRIPTION'),
            usage: '<User:user|Guild:guild|guild:str> [...]',
            usageDelim: ' ',
            guarded: true
        });
        this.terms = ['usersAdded', 'usersRemoved', 'guildsAdded', 'guildsRemoved'];
    }
    async run(message, usersAndGuilds) {
        const changes = [[], [], [], []];
        const queries = [[], []];
        for (const userOrGuild of new Set(usersAndGuilds)) {
            const type = userOrGuild instanceof core_1.User ? 'user' : 'guild';
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const blacklist = this.client.settings.get(`${type}Blacklist`);
            const id = typeof userOrGuild === 'string' ? userOrGuild : userOrGuild.id;
            const name = userOrGuild instanceof core_1.User ? userOrGuild.username : userOrGuild instanceof core_1.Guild ? userOrGuild.name : userOrGuild;
            if (blacklist.includes(id)) {
                changes[this.terms.indexOf(`${type}sRemoved`)].push(name);
            }
            else {
                changes[this.terms.indexOf(`${type}sAdded`)].push(name);
            }
            queries[Number(type === 'guild')].push(id);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.client.settings.update([['userBlacklist', queries[0]], ['guildBlacklist', queries[1]]]);
        return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', changes);
    }
}
exports.default = default_1;
//# sourceMappingURL=blacklist.js.map