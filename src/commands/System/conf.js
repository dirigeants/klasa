const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 6,
			description: 'Define per-server configuration.',
			usage: '<set|get|reset|list|remove> [key:string] [value:string]',
			usageDelim: ' '
		});
	}

	async run(msg, [action, key, ...value]) {
		const { configs } = msg.guild;
		if (action !== 'list' && !key) throw msg.language.get('COMMAND_CONF_NOKEY');
		if (['set', 'remove'].includes(action) && !value[0]) throw msg.language.get('COMMAND_CONF_NOVALUE');
		if (['set', 'remove', 'reset'].includes(action) && !configs.id) await this.client.settings.guilds.create(msg.guild);
		if (['set', 'remove', 'get', 'reset'].includes(action) && !(key in configs)) throw msg.language.get('COMMAND_CONF_GET_NOEXT', key);
		await this[action](msg, configs, key, value);

		return null;
	}

	async set(msg, configs, key, valueToSet) {
		const { path, value } = await this.client.settings.guilds.updateOne(msg.guild, key, valueToSet.join(' '), msg.guild, true);
		if (path.array) return msg.sendMessage(msg.language.get('COMMAND_CONF_ADDED', path.resolveString(msg, value), path.path));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg, value)));
	}

	async remove(msg, configs, key, valueToRemove) {
		const { path, value } = await this.client.settings.guilds.updateArray(msg.guild, 'remove', key, valueToRemove.join(' '), msg.guild, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_REMOVE', path.resolveString(msg, value), path.path));
	}

	async get(msg, configs, key) {
		const { path, route } = this.client.settings.guilds.getPath(key, { avoidUnconfigurable: true, piece: true });
		const result = configs.get(route.join('.'));
		const value = path.resolveString(msg, result);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.path, value));
	}

	async reset(msg, configs, key) {
		const { path, value } = await this.client.settings.guilds.reset(msg.guild, key, msg.guild, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', path.path, path.resolveString(msg, value)));
	}

	list(msg, configs, key) {
		const { path, route } = this.client.settings.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		let object = configs;
		if (route.length >= 1) {
			for (let i = 0; i < route.length; i++) object = object[route[i]];
		}
		const message = path.getList(msg, object);
		return msg.sendCode('asciidoc', `= Server Settings =\n${message}`);
	}

	handle(value) {
		if (typeof value !== 'object') return value;
		if (value === null) return 'Not set';
		if (Array.isArray(value)) return value[0] ? `[ ${value.join(' | ')} ]` : 'None';
		return value;
	}

};
