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

	async run(msg, [action, key = '', ...value]) {
		const configs = await msg.guild.fetchSettings();
		if (['set', 'reset', 'remove'].includes(action) && key === '') throw await msg.fetchLanguageCode('COMMAND_CONF_NOKEY');
		if (['set', 'remove'].includes(action) && value.length === 0) throw await msg.fetchLanguageCode('COMMAND_CONF_NOVALUE');
		await this[action](msg, configs, key, value);

		return null;
	}

	async set(msg, configs, key, valueToSet) {
		const { path, value } = await this.client.settings.guilds.updateOne(msg.guild, key, valueToSet.join(' '), msg.guild, true);
		if (path.array) return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_ADDED', path.toString(value), path.path));
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_UPDATED', path.path, path.toString(value)));
	}

	async remove(msg, configs, key, valueToRemove) {
		const { path, value } = await this.client.settings.guilds.updateArray(msg.guild, 'remove', key, valueToRemove.join(' '), msg.guild, true);
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_REMOVE', path.toString(value), path.path));
	}

	async get(msg, configs, key) {
		const { path } = this.client.settings.guilds.getPath(key, { avoidUnconfigurable: true });
		const settingPath = key.split('.');
		let value = configs;
		for (let i = 0; i < settingPath.length; i++) value = value[settingPath[i]];
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_GET', path.path, path.toString(value)));
	}

	async reset(msg, configs, key) {
		const { path, value } = await this.client.settings.guilds.reset(msg.guild, key, msg.guild, true);
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_RESET', path.path, path.toString(value)));
	}

	async list(msg, configs, key) {
		const { path, route } = this.client.settings.guilds.getPath(key, { avoidUnconfigurable: true, piece: false });
		let object = await msg.fetchGuildSettings();
		if (route.length >= 1) {
			for (let i = 0; i < route.length; i++) object = object[route[i]];
		}
		const message = path.getList(msg, object);
		return msg.send(`= Server Settings =\n${message}`, { code: 'asciidoc' });
	}

	handle(value) {
		if (typeof value !== 'object') return value;
		if (value === null) return 'Not set';
		if (value instanceof Array) return value[0] ? `[ ${value.join(' | ')} ]` : 'None';
		return value;
	}

};
