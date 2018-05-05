const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (message) => message.language.get('COMMAND_CONF_USER_DESCRIPTION'),
			subcommands: true,
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
		const path = this.client.gateways.users.getPath(key, { avoidUnconfigurable: true, errors: false, piece: null });
		if (!path) return message.sendMessage(message.language.get('COMMAND_CONF_GET_NOEXT', key));
		if (path.piece.type === 'Folder') {
			return message.sendMessage(message.language.get('COMMAND_CONF_SERVER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
				codeBlock('asciidoc', message.guild.configs.list(message, path.piece))));
		}
		return message.sendMessage(message.language.get('COMMAND_CONF_GET', path.piece.path, message.guild.configs.resolveString(message, path.piece)));
	}

	async set(message, [key, ...valueToSet]) {
		const { errors, updated } = await message.author.configs.update(key, valueToSet.join(' '), message.guild, { avoidUnconfigurable: true, action: 'add' });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendMessage(message.language.get('COMMAND_CONF_NOCHANGE', key));
		return message.sendMessage(message.language.get('COMMAND_CONF_UPDATED', key, message.author.configs.resolveString(message, updated[0].piece)));
	}

	async remove(message, [key, ...valueToRemove]) {
		const { errors, updated } = await message.author.configs.update(key, valueToRemove.join(' '), message.guild, { avoidUnconfigurable: true, action: 'remove' });
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendMessage(message.language.get('COMMAND_CONF_NOCHANGE', key));
		return message.sendMessage(message.language.get('COMMAND_CONF_UPDATED', key, message.author.configs.resolveString(message, updated[0].piece)));
	}

	async reset(message, [key]) {
		const { errors, updated } = await message.author.configs.reset(key, true);
		if (errors.length) return message.sendMessage(errors[0]);
		if (!updated.length) return message.sendMessage(message.language.get('COMMAND_CONF_NOCHANGE', key));
		return message.sendMessage(message.language.get('COMMAND_CONF_RESET', key, message.author.configs.resolveString(message, updated[0].piece)));
	}

};
