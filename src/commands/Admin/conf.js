const { Command, Schema, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			guarded: true,
			subcommands: true,
			description: language => language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
			usage: '<set|show|remove|reset> (key:key) (value:value)',
			usageDelim: ' '
		});

		this.configurableSchemaKeys = new Map();

		this
			.createCustomResolver('key', (arg, possible, message, [action]) => {
				if (action === 'show' || arg) return arg || '';
				throw message.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, message, [action]) => {
				if (!['set', 'remove'].includes(action)) return null;
				if (arg) return this.client.arguments.get('...string').run(arg, possible, message);
				throw message.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	show(message, [key]) {
		const schemaOrEntry = this.configurableSchemaKeys.get(key);
		if (typeof schemaOrEntry === 'undefined') throw message.language.get('COMMAND_CONF_GET_NOEXT', key);

		const value = key ? message.guild.settings.get(key) : message.guild.settings;
		if (schemaOrEntry.type !== 'Folder') {
			return message.sendLocale('COMMAND_CONF_GET', [key, this.displayEntry(schemaOrEntry, value, message.guild)]);
		}

		return message.sendLocale('COMMAND_CONF_SERVER', [
			key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
			codeBlock('asciidoc', this.displayFolder(value))
		]);
	}

	async set(message, [key, valueToSet]) {
		try {
			const [update] = await message.guild.settings.update(key, valueToSet, { onlyConfigurable: true, arrayAction: 'add' });
			return message.sendLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
		} catch (error) {
			throw String(error);
		}
	}

	async remove(message, [key, valueToRemove]) {
		try {
			const [update] = await message.guild.settings.update(key, valueToRemove, { onlyConfigurable: true, arrayAction: 'remove' });
			return message.sendLocale('COMMAND_CONF_UPDATED', [key, this.displayEntry(update.entry, update.next, message.guild)]);
		} catch (error) {
			throw String(error);
		}
	}

	async reset(message, [key]) {
		try {
			const [update] = await message.guild.settings.reset(key);
			return message.sendLocale('COMMAND_CONF_RESET', [key, this.displayEntry(update.entry, update.next, message.guild)]);
		} catch (error) {
			throw String(error);
		}
	}

	init() {
		const { schema } = this.client.gateways.get('guilds');
		if (this.initFolderConfigurableRecursive(schema)) this.configurableSchemaKeys.set(schema.path, schema);
	}

	displayFolder(settings) {
		const array = [];
		const folders = [];
		const sections = new Map();
		let longest = 0;
		for (const [key, value] of settings.schema.entries()) {
			if (!this.configurableSchemaKeys.has(value.path)) continue;

			if (value.type === 'Folder') {
				folders.push(`// ${key}`);
			} else {
				const values = sections.get(value.type) || [];
				values.push(key);

				if (key.length > longest) longest = key.length;
				if (values.length === 1) sections.set(value.type, values);
			}
		}
		if (folders.length) array.push('= Folders =', ...folders.sort(), '');
		if (sections.size) {
			for (const keyType of [...sections.keys()].sort()) {
				array.push(`= ${toTitleCase(keyType)}s =`,
					...sections.get(keyType).sort().map(key => `${key.padEnd(longest)} :: ${this.displayEntry(settings.schema.get(key), settings.get(key), settings.base.target)}`),
					'');
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
			if (value instanceof Schema) {
				if (this.initFolderConfigurableRecursive(value)) this.configurableSchemaKeys.set(value.path, value);
			} else if (value.configurable) {
				this.configurableSchemaKeys.set(value.path, value);
			}
		}

		return previousConfigurableCount !== this.configurableSchemaKeys.size;
	}

};
