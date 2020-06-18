"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klasa_1 = require("klasa");
const utils_1 = require("@klasa/utils");
const discord_md_tags_1 = require("discord-md-tags");
require("@klasa/dapi-types");
class default_1 extends klasa_1.Command {
    constructor(store, directory, files) {
        super(store, directory, files, {
            aliases: ['commands'],
            guarded: true,
            description: language => language.get('COMMAND_HELP_DESCRIPTION'),
            usage: '(Command:command)'
        });
        this.createCustomResolver('command', (arg, possible, message) => {
            var _a;
            if (!arg)
                return undefined;
            return (_a = this.client.arguments.get('command')) === null || _a === void 0 ? void 0 : _a.run(arg, possible, message);
        });
    }
    async run(message, [command]) {
        if (command) {
            const info = [
                `= ${command.name} = `,
                utils_1.isFunction(command.description) ? command.description(message.language) : command.description,
                message.language.get('COMMAND_HELP_USAGE', command.usage.fullUsage(message)),
                message.language.get('COMMAND_HELP_EXTENDED'),
                utils_1.isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp
            ].join('\n');
            return message.send(mb => mb.setContent(discord_md_tags_1.codeblock('asciidoc') `${info}`));
        }
        const help = await this.buildHelp(message);
        const categories = Object.keys(help);
        const helpMessage = [];
        for (let cat = 0; cat < categories.length; cat++) {
            helpMessage.push(`**${categories[cat]} Commands**:`, '```asciidoc');
            const subCategories = Object.keys(help[categories[cat]]);
            for (let subCat = 0; subCat < subCategories.length; subCat++)
                helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join('\n')}\n`);
            helpMessage.push('```', '\u200b');
        }
        const dm = await message.author.openDM();
        let response = [];
        try {
            response = await dm.send(mb => mb.setContent(helpMessage.join('\n')), { char: '\u200b' });
        }
        catch {
            if (message.channel.type !== 1 /* DM */)
                await message.sendLocale('COMMAND_HELP_NODM');
        }
        if (message.channel.type !== 1 /* DM */)
            await message.sendLocale('COMMAND_HELP_DM');
        return response;
    }
    async buildHelp(message) {
        const help = {};
        const prefix = message.guildSettings.get('prefix');
        const commandNames = [...this.client.commands.keys()];
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        await Promise.all(this.client.commands.map((command) => this.client.inhibitors.run(message, command, true)
            .then(() => {
            if (!Reflect.has(help, command.category))
                help[command.category] = {};
            if (!Reflect.has(help[command.category], command.subCategory))
                Reflect.set(help[command.category], command.subCategory, []);
            const description = typeof command.description === 'function' ? command.description(message.language) : command.description;
            help[command.category][command.subCategory].push(`${prefix}${command.name.padEnd(longest)} :: ${description}`);
        })
            .catch(() => {
            // noop
        })));
        return help;
    }
}
exports.default = default_1;
//# sourceMappingURL=help.js.map