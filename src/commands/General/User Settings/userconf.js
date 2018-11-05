const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			subcommands: true,
			description: language => language.get('COMMAND_CONF_USER_DESCRIPTION'),
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
		const piece = this.getPath(key);
		if (!piece || (piece.type === 'Folder' ? !piece.configurableKeys.length : !piece.configurable)) return message.sendLocale('COMMAND_CONF_GET_NOEXT', [key]);
		if (piece.type === 'Folder') {
			return message.sendLocale('COMMAND_CONF_USER', [
				key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
				codeBlock('asciidoc', message.author.settings.display(message, piece))
			]);
		}
		return message.sendLocale('COMMAND_CONF_GET', [piece.path, message.author.settings.display(message, piece)]);
	}

	async set(message, [key, valueToSet]) {
		const piece = this.check(message, key, await message.author.settings.update(key, valueToSet, { onlyConfigurable: true, arrayAction: 'add', guild: message.guild }));
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.author.settings.display(message, piece)]);
	}

	async remove(message, [key, valueToRemove]) {
		const piece = this.check(message, key, await message.author.settings.update(key, valueToRemove, { onlyConfigurable: true, arrayAction: 'remove', guild: message.guild }));
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.author.settings.display(message, piece)]);
	}

	async reset(message, [key]) {
		const piece = this.check(message, key, await message.author.settings.reset(key));
		return message.sendLocale('COMMAND_CONF_RESET', [key, message.author.settings.display(message, piece)]);
	}

	check(message, key, { errors, updated }) {
		if (errors.length) throw String(errors[0]);
		if (!updated.length) throw message.language.get('COMMAND_CONF_NOCHANGE', key);
		return updated[0].piece;
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
