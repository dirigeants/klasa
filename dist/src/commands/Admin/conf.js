"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const utils_1 = require("@klasa/utils");
require("@klasa/dapi-types");
const discord_md_tags_1 = require("discord-md-tags");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            runIn: [0 /* GuildText */],
            permissionLevel: 6,
            guarded: true,
            subcommands: true,
            description: language => language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
            usage: '<set|remove|reset|show:default> (key:key) (value:value)',
            usageDelim: ' '
        });
        this
            .createCustomResolver('key', (arg, _possible, message, [action]) => {
            if (action === 'show' || arg)
                return arg || '';
            throw message.language.get('COMMAND_CONF_NOKEY');
        })
            .createCustomResolver('value', (arg, possible, message, [action]) => {
            if (!['set', 'remove'].includes(action))
                return null;
            if (arg)
                return this.client.arguments.get('...string').run(arg, possible, message);
            throw message.language.get('COMMAND_CONF_NOVALUE');
        });
    }
    get gateway() {
        return this.client.gateways.get('guilds');
    }
    show(message, [key]) {
        const guild = message.guild;
        if (!key)
            return message.replyLocale('COMMAND_CONF_SERVER', [key, discord_md_tags_1.codeblock('asciidoc') `${this.displayFolder(guild.settings)}`]);
        const entry = this.gateway.schema.get(key);
        if (!entry)
            throw message.language.get('COMMAND_CONF_GET_NOEXT', key);
        const value = guild.settings.get(key);
        return message.replyLocale('COMMAND_CONF_GET', [key, this.displayEntry(entry, value, guild)]);
    }
    async set(message, [key, valueToSet]) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [update] = await message.guild.settings.update(key, valueToSet, { arrayAction: 'add' });
            return message.replyLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
        }
        catch (error) {
            throw String(error);
        }
    }
    async remove(message, [key, valueToRemove]) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [update] = await message.guild.settings.update(key, valueToRemove, { arrayAction: 'remove' });
            return message.replyLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
        }
        catch (error) {
            throw String(error);
        }
    }
    async reset(message, [key]) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [update] = await message.guild.settings.reset(key);
            return message.replyLocale('COMMAND_CONF_RESET', [key, this.displayEntry(update.entry, update.next, message.guild)]);
        }
        catch (error) {
            throw String(error);
        }
    }
    displayFolder(settings) {
        const array = [];
        const sections = new Map();
        let longest = 0;
        for (const [key, value] of settings.gateway.schema.entries()) {
            const values = sections.get(value.type) || [];
            values.push(key);
            if (key.length > longest)
                longest = key.length;
            if (values.length === 1)
                sections.set(value.type, values);
        }
        if (sections.size) {
            for (const keyType of [...sections.keys()].sort()) {
                array.push(`= ${utils_1.toTitleCase(keyType)}s =`, 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...sections.get(keyType).sort().map(key => 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                `${key.padEnd(longest)} :: ${this.displayEntry(settings.gateway.schema.get(key), settings.get(key), settings.target)}`), '');
            }
        }
        return array.join('\n');
    }
    displayEntry(entry, value, guild) {
        return entry.array ?
            this.displayEntryMultiple(entry, value, guild) :
            this.displayEntrySingle(entry, value, guild);
    }
    displayEntrySingle(entry, value, guild) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return entry.serializer.stringify(value, guild);
    }
    displayEntryMultiple(entry, values, guild) {
        return values.length === 0 ?
            'None' :
            `[ ${values.map(value => this.displayEntrySingle(entry, value, guild)).join(' | ')} ]`;
    }
}
exports.default = default_1;
//# sourceMappingURL=conf.js.map