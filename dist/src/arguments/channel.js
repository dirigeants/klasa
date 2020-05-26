"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
class CoreArgument extends klasa_1.Argument {
    async run(argument, possible, message) {
        // Regular Channel support
        const channelID = klasa_1.Argument.regex.channel.exec(argument);
        const channel = channelID ? await this.client.channels.fetch(channelID[1]).catch(() => null) : null;
        if (channel)
            return channel;
        // DM Channel support
        const userID = klasa_1.Argument.regex.userOrMember.exec(argument);
        const user = userID ? await this.client.users.fetch(userID[1]).catch(() => null) : null;
        if (user)
            return user.openDM();
        throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
    }
}
exports.default = CoreArgument;
//# sourceMappingURL=channel.js.map