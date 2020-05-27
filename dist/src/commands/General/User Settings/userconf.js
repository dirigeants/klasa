"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const utils_1 = require("@klasa/utils");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            guarded: true,
            subcommands: true,
            description: language => language.get('COMMAND_CONF_USER_DESCRIPTION'),
            usage: '<set|remove|reset|show:default> (key:key) (value:value)',
            usageDelim: ' '
        });
        this.configurableSchemaKeys = new Map();
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
    show(message, [key]) {
        const schemaOrEntry = this.configurableSchemaKeys.get(key);
        if (typeof schemaOrEntry === 'undefined')
            throw message.language.get('COMMAND_CONF_GET_NOEXT', key);
        const value = key ? message.author.settings.get(key) : message.author.settings;
        if (klasa_1.SchemaEntry.is(schemaOrEntry)) {
            return message.sendLocale('COMMAND_CONF_GET', [key, this.displayEntry(schemaOrEntry, value, message.guild)]);
        }
        return message.sendLocale('COMMAND_CONF_SERVER', [
            key ? `: ${key.split('.').map(utils_1.toTitleCase).join('/')}` : '',
            utils_1.codeBlock('asciidoc', this.displayFolder(value))
        ]);
    }
    async set(message, [key, valueToSet]) {
        try {
            const [update] = await message.author.settings.update(key, valueToSet, { onlyConfigurable: true, arrayAction: 'add' });
            return message.sendLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
        }
        catch (error) {
            throw String(error);
        }
    }
    async remove(message, [key, valueToRemove]) {
        try {
            const [update] = await message.author.settings.update(key, valueToRemove, { onlyConfigurable: true, arrayAction: 'remove' });
            return message.sendLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
        }
        catch (error) {
            throw String(error);
        }
    }
    async reset(message, [key]) {
        try {
            const [update] = await message.author.settings.reset(key);
            return message.sendLocale('COMMAND_CONF_RESET', [key, this.displayEntry(update.entry, update.next, message.guild)]);
        }
        catch (error) {
            throw String(error);
        }
    }
    init() {
        const { schema } = this.client.gateways.get('users');
        if (this.initFolderConfigurableRecursive(schema))
            this.configurableSchemaKeys.set(schema.path, schema);
    }
    displayFolder(settings) {
        const array = [];
        const folders = [];
        const sections = new Map();
        let longest = 0;
        for (const [key, value] of settings.schema.entries()) {
            if (!this.configurableSchemaKeys.has(value.path))
                continue;
            if (value.type === 'Folder') {
                folders.push(`// ${key}`);
            }
            else {
                const values = sections.get(value.type) || [];
                values.push(key);
                if (key.length > longest)
                    longest = key.length;
                if (values.length === 1)
                    sections.set(value.type, values);
            }
        }
        if (folders.length)
            array.push('= Folders =', ...folders.sort(), '');
        if (sections.size) {
            for (const keyType of [...sections.keys()].sort()) {
                array.push(`= ${utils_1.toTitleCase(keyType)}s =`, 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...sections.get(keyType).sort().map(key => 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                `${key.padEnd(longest)} :: ${this.displayEntry(settings.schema.get(key), settings.get(key), settings.base.target)}`), '');
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
    initFolderConfigurableRecursive(folder) {
        const previousConfigurableCount = this.configurableSchemaKeys.size;
        for (const value of folder.values()) {
            if (klasa_1.SchemaFolder.is(value)) {
                if (this.initFolderConfigurableRecursive(value))
                    this.configurableSchemaKeys.set(value.path, value);
            }
            else if (value.configurable) {
                this.configurableSchemaKeys.set(value.path, value);
            }
        }
        return previousConfigurableCount !== this.configurableSchemaKeys.size;
    }
}
exports.default = default_1;
//# sourceMappingURL=userconf.js.map