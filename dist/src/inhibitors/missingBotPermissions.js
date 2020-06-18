"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
require("@klasa/dapi-types");
class default_1 extends klasa_1.Inhibitor {
    constructor() {
        super(...arguments);
        this.impliedPermissions = new core_1.Permissions(515136).freeze();
        // VIEW_CHANNEL, SEND_MESSAGES, SEND_TTS_MESSAGES, EMBED_LINKS, ATTACH_FILES,
        // READ_MESSAGE_HISTORY, MENTION_EVERYONE, USE_EXTERNAL_EMOJIS, ADD_REACTIONS
        this.friendlyPerms = Object.keys(core_1.Permissions.FLAGS).reduce((obj, key) => {
            Reflect.set(obj, key, utils_1.toTitleCase(key.split('_').join(' ')));
            return obj;
        }, {});
    }
    run(message, command) {
        const missing = message.channel.type === 0 /* GuildText */ ?
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (message.guild.me?.permissionsIn(message.channel).missing(command.requiredPermissions) ?? []) :
            this.impliedPermissions.missing(command.requiredPermissions);
        if (missing.length)
            throw message.language.get('INHIBITOR_MISSING_BOT_PERMS', missing.map(key => this.friendlyPerms[key]).join(', '));
    }
}
exports.default = default_1;
//# sourceMappingURL=missingBotPermissions.js.map