const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permissionLevel: 6,
			guarded: true,
			subcommands: true,
			description: language => language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
			usage: '<set|show|remove|reset> (key:key) (value:value) [...]',
			usageDelim: ' '
		});

		this
			.createCustomResolver('key', (arg, possible, message, [action]) => {
				if (action === 'show' || arg) return arg;
				throw message.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, message, [action]) => {
				if (!['set', 'remove'].includes(action) || arg) return arg;
				throw message.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	show(message, [key]) {
		const piece = this.client.gateways.guilds.schema.get(key);
		if (!piece || piece.type === 'Folder' ? !piece.configurableKeys.length : !piece.configurable) return message.sendLocale('COMMAND_CONF_GET_NOEXT', [key]);
		if (piece.type === 'Folder') {
			return message.sendLocale('COMMAND_CONF_SERVER', [
				key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
				codeBlock('asciidoc', message.guild.settings.display(message, piece))
			]);
		}
		return message.sendLocale('COMMAND_CONF_GET', [piece.path, message.guild.settings.display(message, piece)]);
	}

	async set(message, [key, ...valueToSet]) {
		const { errors, updated } = await message.guild.settings.update(key, valueToSet.join(' '), message.guild, { avoidUnconfigurable: true, action: 'add' });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendLocale('COMMAND_CONF_NOCHANGE', [key]);
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.guild.settings.display(message, updated[0].piece)]);
	}

	async remove(message, [key, ...valueToRemove]) {
		const { errors, updated } = await message.guild.settings.update(key, valueToRemove.join(' '), message.guild, { avoidUnconfigurable: true, action: 'remove' });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendLocale('COMMAND_CONF_NOCHANGE', [key]);
		return message.sendLocale('COMMAND_CONF_UPDATED', [key, message.guild.settings.display(message, updated[0].piece)]);
	}

	async reset(message, [key]) {
		const { errors, updated } = await message.guild.settings.reset(key, message.guild, true);
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendLocale('COMMAND_CONF_NOCHANGE', [key]);
		return message.sendLocale('COMMAND_CONF_RESET', [key, message.guild.settings.display(message, updated[0].piece)]);
	}

};
