"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
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
        var _a, _b;
        const missing = message.channel.type === 0 /* GuildText */ ? (_b = (_a = 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        message.guild.me) === null || _a === void 0 ? void 0 : _a.permissionsIn(message.channel).missing(command.requiredPermissions, false)) !== null && _b !== void 0 ? _b : [] :
            this.impliedPermissions.missing(command.requiredPermissions, false);
        if (missing.length)
            throw message.language.get('INHIBITOR_MISSING_BOT_PERMS', missing.map(key => this.friendlyPerms[key]).join(', '));
    }
}
exports.default = default_1;
//# sourceMappingURL=missingBotPermissions.js.map