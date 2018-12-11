const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

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

		this
			.createCustomResolver('key', (arg, possible, message, [action]) => {
				if (action === 'show' || arg) return arg;
				throw message.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, message, [action]) => {
				if (!['set', 'remove'].includes(action)) return null;
				if (arg) return this.client.arguments.get('...string').run(arg, possible, message);
				throw message.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	show(message, [key]) {
		const entry = this.getPath(key);
		if (!entry || (entry.type === 'Folder' ? !entry.configurableKeys.length : !entry.configurable)) return message.sendLocale('COMMAND_CONF_GET_NOEXT', [key]);
		if (entry.type === 'Folder') {
			return message.sendLocale('COMMAND_CONF_SERVER', [
				key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
				codeBlock('asciidoc', message.guild.settings.display(message, entry))
			]);
		}
		return message.sendLocale('COMMAND_CONF_GET', [entry.path, message.guild.settings.display(message, entry)]);
	}

	async set(message, [key, valueToSet]) {
		const entry = this.check(message, key, await message.guild.settings.update(key, valueToSet, { onlyConfigurable: true, arrayAction: 'add' }));
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.guild.settings.display(message, entry)]);
	}

	async remove(message, [key, valueToRemove]) {
		const entry = this.check(message, key, await message.guild.settings.update(key, valueToRemove, { onlyConfigurable: true, arrayAction: 'remove' }));
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.guild.settings.display(message, entry)]);
	}

	async reset(message, [key]) {
		const entry = this.check(message, key, await message.guild.settings.reset(key));
		return message.sendLocale('COMMAND_CONF_RESET', [key, message.guild.settings.display(message, entry)]);
	}

	check(message, key, { errors, updated }) {
		if (errors.length) throw String(errors[0]);
		if (!updated.length) throw message.language.get('COMMAND_CONF_NOCHANGE', key);
		return updated[0].entry;
	}

	getPath(key) {
		const { schema } = this.client.gateways.get('guilds');
		if (!key) return schema;
		try {
			return schema.get(key);
		} catch (__) {
			return undefined;
		}
	}

};
