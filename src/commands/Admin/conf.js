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
		const { piece } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: true });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', piece.path, msg.guild.configs.resolveString(msg, piece)));
	}

	async set(msg, [key, ...valueToSet]) {
		const { piece } = await msg.guild.configs.update(key, valueToSet.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', piece.path, msg.guild.configs.resolveString(msg, piece)));
	}

	async remove(msg, [key, ...valueToRemove]) {
		const { piece } = await msg.guild.configs.update(key, valueToRemove.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', piece.path, msg.guild.configs.resolveString(msg, piece)));
	}

	async reset(msg, [key]) {
		const { piece } = await msg.guild.configs.reset(key, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', piece.path, msg.guild.configs.resolveString(msg, piece)));
	}

	list(msg, [key]) {
		const { piece } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_SERVER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '',
			codeBlock('asciidoc', msg.guild.configs.list(msg, piece))));
	}

};
