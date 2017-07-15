const ParsedUsage = require('../parsers/ParsedUsage');

module.exports = class Command {

	constructor(client, dir, file, name, {
		enabled = true,
		runIn = ['text', 'dm', 'group'],
		cooldown = 0,
		aliases = [],
		permLevel = 0,
		botPerms = [],
		requiredSettings = [],
		description = '',
		usage = '',
		usageDelim = undefined
	}) {
		this.client = client;
		this.type = 'command';
		this.conf = { enabled, runIn, cooldown, aliases, permLevel, botPerms, requiredSettings };
		this.help = { name, description, usage, usageDelim, fullCategory: file, category: file[0] || 'General', subCategory: file[1] || 'General' };
		this.usage = new ParsedUsage(client, this);
		this.cooldown = new Map();
		this.dir = dir;
	}

	async reload() {
		const cmd = this.client.commands.load(this.dir, this.help.fullCategory);
		cmd.init();
		return cmd;
	}

	disable() {
		this.conf.enabled = false;
		return this;
	}

	enable() {
		this.conf.enabled = true;
		return this;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
