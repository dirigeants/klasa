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
		const configs = await msg.guild.fetchSettings();
		if (action !== 'list' && !key) throw msg.fetchLanguageCode('COMMAND_CONF_NOKEY');
		if (['set', 'remove'].includes(action) && value.length === 0) throw msg.fetchLanguageCode('COMMAND_CONF_NOVALUE');
		await this[action](msg, configs, key, value);

		return null;
	}

	async set(msg, configs, key, valueToSet) {
		const { path, value } = await this.client.settings.guilds.updateOne(msg.guild, key, valueToSet.join(' '), msg.guild, true);
		if (path.array) return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_UPDATED', path.path, path.toString(value)));
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_ADDED', path.toString(value), path.path));
	}

	async remove(msg, configs, key, valueToRemove) {
		const { path, value } = await this.client.settings.guilds.updateArray(msg.guild, 'remove', key, valueToRemove.join(' '), msg.guild, true);
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_REMOVE', path.toString(value), path.path));
	}

	async get(msg, configs, key) {
		const { path } = this.client.settings.guilds.getPath(key, true);
		const settingPath = key.split('.');
		let value = configs;
		for (let i = 0; i < settingPath.length; i++) value = value[settingPath[i]];
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_GET', path.path, path.toString(value)));
	}

	async reset(msg, configs, key) {
		const { path, value } = await this.client.settings.guilds.reset(msg.guild, key, msg.guild, true);
		return msg.sendMessage(await msg.fetchLanguageCode('COMMAND_CONF_RESET', path.path, path.toString(value)));
	}

	async list(msg, configs) {
		const longest = Object.keys(configs).sort((a, b) => a.length < b.length)[0].length;
		const output = ['= Guild Settings ='];
		const entries = Object.entries(configs);
		for (let i = 0; i < entries.length; i++) {
			if (entries[i][0] === 'id') continue;
			output.push(`${entries[i][0].padEnd(longest)} :: ${this.handle(entries[i][1])}`);
		}
		return msg.sendCode('asciidoc', output);
	}

	handle(value) {
		if (typeof value !== 'object') return value;
		if (value === null) return 'Not set';
		if (value instanceof Array) return value[0] ? `[ ${value.join(' | ')} ]` : 'None';
		return value;
	}

	// Pending to implement tomorrow.
	resolveString(msg, output, path, value) {
		if (path.configurable === false) return;
		let resolver = (val) => val;
		switch (path.type) {
			case 'Folder': resolver = () => '[ Folder';
				break;
			case 'user': resolver = (val) => (this.client.users.get(val) || { username: val }).username;
				break;
			case 'textchannel':
			case 'voicechannel':
			case 'channel': resolver = (val) => `#${(msg.guild.channels.get(val) || { name: val }).name}`;
				break;
			case 'role': resolver = (val) => `@${(msg.guild.roles.get(val) || { name: val }).name}`;
				break;
			case 'guild':
			case 'command':
			case 'language': resolver = (val) => val.name;
				break;
			// no default
		}

		output.push(path.array ? value.length > 0 ? `[ ${value.map(resolver).join(' | ')} ]` : 'None' : value === null ? 'Not set' : resolver(value));
	}

};
