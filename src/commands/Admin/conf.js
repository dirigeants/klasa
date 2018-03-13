const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 6,
			guarded: true,
			subcommands: true,
			description: (msg) => msg.language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
			usage: '<get|set|remove|reset|list> (key:key) (value:value) [...]',
			usageDelim: ' '
		});

		this
			.createCustomResolver('key', (arg, possible, msg, [action]) => {
				if (action === 'list' || arg) return arg;
				throw msg.language.get('COMMAND_CONF_NOKEY');
			})
			.createCustomResolver('value', (arg, possible, msg, [action]) => {
				if (!['set', 'remove'].includes(action) || arg) return arg;
				throw msg.language.get('COMMAND_CONF_NOVALUE');
			});
	}

	get(msg, [key]) {
		const path = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: true, errors: false });
		if (!path) return msg.sendMessage(msg.language.get('COMMAND_CONF_GET_NOEXT', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.piece.path, msg.guild.configs.resolveString(msg, path.piece)));
	}

	async set(msg, [key, ...valueToSet]) {
		const { errors, updated } = await msg.guild.configs.update(key, valueToSet.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });
		if (errors.length) return msg.sendMessage(errors[0]);
		if (!updated.length) return msg.sendMessage(msg.language.get('COMMAND_CONF_NOCHANGE', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', key, msg.guild.configs.resolveString(msg, updated[0].piece)));
	}

	async remove(msg, [key, ...valueToRemove]) {
		const { errors, updated } = await msg.guild.configs.update(key, valueToRemove.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });
		if (errors.length) return msg.sendMessage(errors[0]);
		if (!updated.length) return msg.sendMessage(msg.language.get('COMMAND_CONF_NOCHANGE', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', key, msg.guild.configs.resolveString(msg, updated[0].piece)));
	}

	async reset(msg, [key]) {
		const { errors, updated } = await msg.guild.configs.reset(key, msg.guild, true);
		if (errors.length) return msg.sendMessage(errors[0]);
		if (!updated.length) return msg.sendMessage(msg.language.get('COMMAND_CONF_NOCHANGE', key));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', key, msg.guild.configs.resolveString(msg, updated[0].piece)));
	}

	list(msg, [key]) {
		const { piece } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_SERVER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
			codeBlock('asciidoc', msg.guild.configs.list(msg, piece))));
	}

};
