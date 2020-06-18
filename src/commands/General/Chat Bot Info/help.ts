import { Command, CommandStore } from 'klasa';
import { isFunction } from '@klasa/utils';
import { codeblock } from 'discord-md-tags';
import { ChannelType } from '@klasa/dapi-types';

import type { Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			aliases: ['commands'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg) return undefined;
			return this.client.arguments.get('command')?.run(arg, possible, message);
		});
	}

	async run(message: Message, [command]: [Command]): Promise<Message[]> {
		if (command) {
			const info = [
				`= ${command.name} = `,
				isFunction(command.description) ? command.description(message.language) : command.description,
				message.language.get('COMMAND_HELP_USAGE', command.usage.fullUsage(message)),
				message.language.get('COMMAND_HELP_EXTENDED'),
				isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp
			].join('\n');
			return message.reply(mb => mb.setContent(codeblock('asciidoc') `${info}`));
		}
		const help = await this.buildHelp(message);
		const categories = Object.keys(help);
		const helpMessage: string[] = [];
		for (let cat = 0; cat < categories.length; cat++) {
			helpMessage.push(`**${categories[cat]} Commands**:`, '```asciidoc');
			const subCategories = Object.keys(help[categories[cat]]);
			for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join('\n')}\n`);
			helpMessage.push('```', '\u200b');
		}

		const dm = await message.author.openDM();

		let response: Message[] = [];

		try {
			response = await dm.send(mb => mb.setContent(helpMessage.join('\n')), { char: '\u200b' });
		} catch {
			if (message.channel.type !== ChannelType.DM) await message.replyLocale('COMMAND_HELP_NODM');
		}

		if (message.channel.type !== ChannelType.DM) await message.replyLocale('COMMAND_HELP_DM');

		return response;
	}

	private async buildHelp(message: Message): Promise<Record<string, Record<string, string[]>>> {
		const help: Record<string, Record<string, string[]>> = {};

		const prefix = message.guildSettings.get('prefix');
		const commandNames = [...this.client.commands.keys()];
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					if (!Reflect.has(help, command.category)) help[command.category] = {};
					if (!Reflect.has(help[command.category], command.subCategory)) Reflect.set(help[command.category], command.subCategory, []);
					const description = typeof command.description === 'function' ? command.description(message.language) : command.description;
					help[command.category][command.subCategory].push(`${prefix}${command.name.padEnd(longest)} :: ${description}`);
				})
				.catch(() => {
					// noop
				})
		));

		return help;
	}

}
