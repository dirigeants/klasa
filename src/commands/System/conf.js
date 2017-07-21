const { Command } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 3,
			description: 'Define per-server configuration.',
			usage: '<set|get|reset|list|remove> [key:string] [value:string]',
			usageDelim: ' '
		});
	}

	async run(msg, [action, key, ...value]) {
		const configs = msg.guild.settings;
		this[action](msg, configs, key, value);

		return null;
	}

	async set(msg, configs, key, value) {
		if (!key) return msg.sendMessage('You must provide a key');
		if (!value[0]) return msg.sendMessage('You must provide a value');
		if (!configs.id) await this.client.settingGateway.create(msg.guild);
		if (this.client.settingGateway.schemaManager.schema[key].array) {
			await this.client.settingGateway.updateArray(msg.guild, 'add', key, value.join(' '));
			return msg.sendMessage(`Successfully added the value \`${value.join(' ')}\` to the key: **${key}**`);
		}
		const response = await this.client.settingGateway.update(msg.guild, key, value.join(' '));
		return msg.sendMessage(`Successfully updated the key **${key}**: \`${response}\``);
	}

	async remove(msg, configs, key, value) {
		if (!key) return msg.sendMessage('You must provide a key');
		if (!value[0]) return msg.sendMessage('You must provide a value');
		if (!configs.id) await this.client.settingGateway.create(msg.guild);
		if (!this.client.settingGateway.schema[key].array) return msg.sendMessage("This key is not array type. Use the action 'reset' instead.");
		return this.client.settingGateway.updateArray(msg.guild, 'remove', key, value.join(' '))
			.then(() => msg.sendMessage(`Successfully removed the value \`${value.join(' ')}\` from the key: **${key}**`))
			.catch(err => msg.sendMessage(err));
	}

	async get(msg, configs, key) {
		if (!key) return msg.sendMessage('You must provide a key');
		if (!(key in configs)) return msg.sendMessage(`The key **${key}** does not seem to exist.`);
		return msg.sendMessage(`The value for the key **${key}** is: \`${inspect(configs[key])}\``);
	}

	async reset(msg, configs, key) {
		if (!key) return msg.sendMessage('You must provide a key');
		if (!configs.id) await this.client.settingGateway.create(msg.guild);
		const response = await this.client.settingGateway.reset(msg.guild, key);
		return msg.sendMessage(`The key **${key}** has been reset to: \`${response}\``);
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

};
