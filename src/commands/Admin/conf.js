const { Command, util: { toTitleCase, codeBlock } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 6,
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_CONF_SERVER_DESCRIPTION'),
			usage: '<get|set|remove|reset|list> <key:key> <value:value> [...]',
			usageDelim: ' '
		});

		this
			.createCustomResolver('key', (arg, possible, msg, [action]) => {
				if (action === 'list' || arg) return arg;
				throw undefined;
			})
			.createCustomResolver('value', (arg, possible, msg, [action]) => {
				if (!['set', 'remove'].includes(action) || arg) return arg;
				throw undefined;
			})
			.customizeResponse('key', msg => msg.language.get('COMMAND_CONF_NOKEY'))
			.customizeResponse('value', msg => msg.language.get('COMMAND_CONF_NOVALUE'));
	}

	async run(msg, [action, key, ...value]) {
		if (action === 'set' && key === 'disabledCommands') {
			const command = this.client.commands.get(value.join(' '));
			if (command && command.guarded) throw msg.language.get('COMMAND_CONF_GUARDED', command.name);
		}
		return this[action](msg, key, value);
	}

	get(msg, key) {
		const { path } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: true });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.path, path.resolveString(msg)));
	}

	async set(msg, key, valueToSet) {
		const { path } = await msg.guild.configs.update(key, valueToSet.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'add' });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg)));
	}

	async remove(msg, key, valueToRemove) {
		const { path } = await msg.guild.configs.update(key, valueToRemove.join(' '), msg.guild, { avoidUnconfigurable: true, action: 'remove' });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg)));
	}

	async reset(msg, key) {
		const { path } = await msg.guild.configs.reset(key, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', path.path, path.resolveString(msg)));
	}

	list(msg, key) {
		const { path } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		return msg.sendMessage(msg.language.get('COMMAND_CONF_SERVER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '', codeBlock('asciidoc', path.getList(msg))));
	}

};
