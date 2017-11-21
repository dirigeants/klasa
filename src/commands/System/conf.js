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

	run(msg, [action, key, ...value]) {
		if (['set', 'reset', 'remove'].includes(action) && typeof key === 'undefined') {
			return Promise.reject(msg.language.get('COMMAND_CONF_NOKEY'));
		}
		if (['set', 'remove'].includes(action) && value.length === 0) {
			return Promise.reject(msg.language.get('COMMAND_CONF_NOVALUE'));
		}
		return this[action](msg, key, value);
	}

	async set(msg, key, valueToSet) {
		const { path, value } = await this.client.settings.guilds.updateOne(msg.guild, key, valueToSet.join(' '), msg.guild, true);
		if (path.array) return msg.sendMessage(msg.language.get('COMMAND_CONF_ADDED', path.resolveString(msg, value), path.path));
		return msg.sendMessage(msg.language.get('COMMAND_CONF_UPDATED', path.path, path.resolveString(msg, value)));
	}

	async remove(msg, key, valueToRemove) {
		const { path, value } = await this.client.settings.guilds.updateArray(msg.guild, 'remove', key, valueToRemove.join(' '), msg.guild, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_REMOVE', path.resolveString(msg, value), path.path));
	}

	async get(msg, key) {
		const { path, route } = this.client.settings.guilds.getPath(key, { avoidUnconfigurable: true, piece: true });
		let object = msg.guild.settings;
		if (route.length > 0) for (let i = 0; i < route.length; i++) object = object[route[i]];
		const value = path.resolveString(msg, object);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_GET', path.path, value));
	}

	async reset(msg, key) {
		const { path, value } = await this.client.settings.guilds.reset(msg.guild, key, msg.guild, true);
		return msg.sendMessage(msg.language.get('COMMAND_CONF_RESET', path.path, path.resolveString(msg, value)));
	}

	async list(msg, key) {
		const { path, route } = this.client.settings.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		let object = msg.guild.settings;
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
