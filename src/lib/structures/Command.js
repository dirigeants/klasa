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
		this.enabled = enabled;
		this.runIn = runIn;
		this.cooldown = cooldown;
		this.aliases = aliases;
		this.permLevel = permLevel;
		this.botPerms = botPerms;
		this.requiredSettings = requiredSettings;
		this.name = name;
		this.description = description;
		this.usageString = usage;
		this.usageDelim = usageDelim;
		this.fullCategory = file;
		this.category = file[0] || 'General';
		this.subCategory = file[1] || 'General';
		this.usage = new ParsedUsage(client, this);
		this.cooldowns = new Map();
		this.file = file;
		this.dir = dir;
	}

	async reload() {
		const cmd = this.client.commands.load(this.dir, this.file);
		cmd.init();
		return cmd;
	}

	disable() {
		this.enabled = false;
		return this;
	}

	enable() {
		this.enabled = true;
		return this;
	}

	run() {
		// Defined in extension Classes
	}

	init() {
		// Optionally defined in extension Classes
	}

};
