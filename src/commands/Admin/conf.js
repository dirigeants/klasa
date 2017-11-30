const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 6,
			guarded: true,
			description: 'Define per-server configuration.',
			usage: '<set|get|reset|list|remove> [key:string] [value:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [action, key, ...value]) {
		const { configs } = msg.guild;
		if (action !== 'list' && !key) throw msg.language.get('COMMAND_CONF_NOKEY');
		if (['set', 'remove'].includes(action) && value.length === 0) throw msg.language.get('COMMAND_CONF_NOVALUE');
		if (action === 'set' && key === 'disabledCommands') {
			const command = this.client.commands.get(value.join(' '));
			if (command && command.guarded) throw msg.language.get('COMMAND_CONF_GUARDED', command.name);
		}
		return this[action](msg, configs, key, value);
	}

	async set(msg, configs, key, valueToSet) {
		const { path, value } = await this.client.gateways.guilds.updateOne(msg.guild, key, valueToSet.join(' '), msg.guild, true);
		if (path.array) return msg.sendMessage(msg.language.get('COMMAND_CONF_ADDED', path.resolveString(msg, value), path.path));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg, value)));
	}

	async remove(msg, configs, key, valueToRemove) {
		const { path, value } = await this.client.gateways.guilds.updateArray(msg.guild, 'remove', key, valueToRemove.join(' '), msg.guild, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_REMOVE', path.resolveString(msg, value), path.path));
	}

	async get(msg, configs, key) {
		const { path, route } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: true });
		const result = configs.get(route.join('.'));
		const value = path.resolveString(msg, result);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.path, value));
	}

	async reset(msg, configs, key) {
		const { path, value } = await this.client.gateways.guilds.reset(msg.guild, key, msg.guild, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', path.path, path.resolveString(msg, value)));
	}

	list(msg, configs, key) {
		const { path, route } = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		let object = configs;
		if (route.length >= 1) {
			for (let i = 0; i < route.length; i++) object = object[route[i]];
		}
		const message = path.getList(msg, object);
		return msg.sendCode('asciidoc', `= Server Configuration =\n${message}`);
	}

	handle(value) {
		if (typeof value !== 'object') return value;
		if (value === null) return 'Not set';
		if (Array.isArray(value)) return value[0] ? `[ ${value.join(' | ')} ]` : 'None';
		return value;
	}

};
