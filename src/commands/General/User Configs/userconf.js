const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_CONF_USER_DESCRIPTION'),
			subcommands: true,
			usage: '<set|show|remove|reset> (key:key) (value:value) [...]',
			usageDelim: ' '
		});

		this
			.createCustomResolver('key', (arg, possible, msg, [action]) => {
				if (action === 'show' || arg) return arg;
				throw msg.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, msg, [action]) => {
				if (!['set', 'remove'].includes(action) || arg) return arg;
				throw msg.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	show(msg, [key]) {
		const path = this.client.gateways.users.getPath(key, { avoidUnconfigurable: true, errors: false, piece: null });
		if (!path) return msg.sendMessage(msg.language.get('COMMAND_CONF_GET_NOEXT', key));
		if (path.piece.type === 'Folder') {
			return msg.sendMessage(msg.language.get('COMMAND_CONF_SERVER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
				codeBlock('asciidoc', msg.guild.configs.list(msg, path.piece))));
		}
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.piece.path, msg.guild.configs.resolveString(msg, path.piece)));
	}

	async set(msg, [key, ...valueToSet]) {
		const { errors, updated } = await msg.author.configs.update(key, valueToSet.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });
		if (errors.length) return msg.sendMessage(errors[0]);
		if (!updated.length) return msg.sendMessage(msg.language.get('COMMAND_CONF_NOCHANGE', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', key, msg.author.configs.resolveString(msg, updated[0].piece)));
	}

	async remove(msg, [key, ...valueToRemove]) {
		const { errors, updated } = await msg.author.configs.update(key, valueToRemove.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });
		if (errors.length) return msg.sendMessage(errors[0]);
		if (!updated.length) return msg.sendMessage(msg.language.get('COMMAND_CONF_NOCHANGE', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', key, msg.author.configs.resolveString(msg, updated[0].piece)));
	}

	async reset(msg, [key]) {
		const { errors, updated } = await msg.author.configs.reset(key, true);
		if (errors.length) return msg.sendMessage(errors[0]);
		if (!updated.length) return msg.sendMessage(msg.language.get('COMMAND_CONF_NOCHANGE', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', key, msg.author.configs.resolveString(msg, updated[0].piece)));
	}

};
