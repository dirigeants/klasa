import { Argument, Command, CommandStore, Settings, SchemaEntry, Gateway } from 'klasa';
import { toTitleCase } from '@klasa/utils';
import { codeblock } from 'discord-md-tags';

import type { Message, Guild } from '@klasa/core';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			guarded: true,
			subcommands: true,
			description: language => language.get('COMMAND_CONF_USER_DESCRIPTION'),
			usage: '<set|remove|reset|show:default> (key:key) (value:value)',
			usageDelim: ' '
		});

		this
			.createCustomResolver('key', (arg, _possible, message, [action]) => {
				if (action === 'show' || arg) return arg || '';
				throw message.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, message, [action]) => {
				if (!['set', 'remove'].includes(action)) return null;
				if (arg) return (this.client.arguments.get('...string') as Argument).run(arg, possible, message);
				throw message.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	private get gateway(): Gateway {
		return this.client.gateways.get('users') as Gateway;
	}

	public show(message: Message, [key]: [string]): Promise<Message[]> {
		if (!key) return message.sendLocale('COMMAND_CONF_SERVER', [key, codeblock('asciidoc')`${this.displayFolder(message.author.settings)}`]);

		const entry = this.gateway.schema.get(key);
		if (!entry) throw message.language.get('COMMAND_CONF_GET_NOEXT', key);

		const value = message.author.settings.get(key);
		return message.sendLocale('COMMAND_CONF_GET', [key, this.displayEntry(entry, value, message.guild)]);
	}

	public async set(message: Message, [key, valueToSet]: [string, string]): Promise<Message[]> {
		try {
			const [update] = await message.author.settings.update(key, valueToSet, { arrayAction: 'add' });
			return message.sendLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
		} catch (error) {
			throw String(error);
		}
	}

	public async remove(message: Message, [key, valueToRemove]: [string, string]): Promise<Message[]> {
		try {
			const [update] = await message.author.settings.update(key, valueToRemove, { arrayAction: 'remove' });
			return message.sendLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
		} catch (error) {
			throw String(error);
		}
	}

	public async reset(message: Message, [key]: [string]): Promise<Message[]> {
		try {
			const [update] = await message.author.settings.reset(key);
			return message.sendLocale('COMMAND_CONF_RESET', [key, this.displayEntry(update.entry, update.next, message.guild)]);
		} catch (error) {
			throw String(error);
		}
	}

	private displayFolder(settings: Settings): string {
		const array = [];
		const sections = new Map<string, string[]>();
		let longest = 0;
		for (const [key, value] of settings.gateway.schema.entries()) {
			const values = sections.get(value.type) || [];
			values.push(key);

			if (key.length > longest) longest = key.length;
			if (values.length === 1) sections.set(value.type, values);
		}
		if (sections.size) {
			for (const keyType of [...sections.keys()].sort()) {
				array.push(`= ${toTitleCase(keyType)}s =`,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					...sections.get(keyType)!.sort().map(key =>
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						`${key.padEnd(longest)} :: ${this.displayEntry(settings.gateway.schema.get(key) as SchemaEntry, settings.get(key), null)}`),
					'');
			}
		}
		return array.join('\n');
	}

	private displayEntry(entry: SchemaEntry, value: unknown, guild: Guild | null): string {
		return entry.array ?
			this.displayEntryMultiple(entry, value as readonly unknown[], guild) :
			this.displayEntrySingle(entry, value, guild);
	}

	private displayEntrySingle(entry: SchemaEntry, value: unknown, guild: Guild | null): string {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return entry.serializer!.stringify(value, guild);
	}

	private displayEntryMultiple(entry: SchemaEntry, values: readonly unknown[], guild: Guild | null): string {
		return values.length === 0 ?
			'None' :
			`[ ${values.map(value => this.displayEntrySingle(entry, value, guild)).join(' | ')} ]`;
	}

}
