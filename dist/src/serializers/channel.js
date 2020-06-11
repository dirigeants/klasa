"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const core_1 = require("@klasa/core");
require("@klasa/dapi-types");
class CoreSerializer extends klasa_1.Serializer {
    constructor(store, directory, file) {
        super(store, directory, file, { aliases: ['textchannel', 'voicechannel', 'categorychannel', 'storechannel', 'newschannel'] });
    }
    async validate(data, { entry, language, guild }) {
        if (data instanceof core_1.Channel)
            return this.checkChannel(data, entry, language);
        const parsed = klasa_1.Serializer.regex.channel.exec(data);
        const channel = parsed ? (guild || this.client).channels.get(parsed[1]) : null;
        if (channel)
            return this.checkChannel(channel, entry, language);
        throw language.get('RESOLVER_INVALID_CHANNEL', entry.key);
    }
    serialize(value) {
        return value.id;
    }
    stringify(value) {
        return value.name;
    }
    checkChannel(data, entry, language) {
        if (entry.type === 'channel' ||
            (entry.type === 'textchannel' && data.type === 0 /* GuildText */) ||
            (entry.type === 'voicechannel' && data.type === 2 /* GuildVoice */) ||
            (entry.type === 'categorychannel' && data.type === 4 /* GuildCategory */) ||
            (entry.type === 'storechannel' && data.type === 6 /* GuildStore */) ||
            (entry.type === 'newschannel' && data.type === 5 /* GuildNews */))
            return data;
        throw language.get('RESOLVER_INVALID_CHANNEL', entry.key);
    }
}
exports.default = CoreSerializer;
//# sourceMappingURL=channel.js.map