const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_CONF_USER_DESCRIPTION'),
			usage: '<set|get|reset|list|remove> [key:string] [value:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [action, key, ...value]) {
		if (action !== 'list' && !key) throw msg.language.get('COMMAND_CONF_NOKEY');
		if (['set', 'remove'].includes(action) && value.length === 0) throw msg.language.get('COMMAND_CONF_NOVALUE');
		return this[action](msg, key, value);
	}

	async set(msg, key, valueToSet) {
		const { path } = await msg.author.configs.update(key, valueToSet.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg)));
	}

	async remove(msg, key, valueToRemove) {
		const { path } = await msg.author.configs.update(key, valueToRemove.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg)));
	}

	async reset(msg, key) {
		const { path } = await msg.author.configs.reset(key, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', path.path, path.resolveString(msg)));
	}

	get(msg, key) {
		const { path } = this.client.gateways.users.getPath(key, { avoidUnconfigurable: true, piece: true });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.path, path.resolveString(msg)));
	}

	list(msg, key) {
		const { path } = this.client.gateways.users.getPath(key, { avoidUnconfigurable: true, piece: false });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_USER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '', codeBlock('asciidoc', path.getList(msg))));
	}

};
