const { Command, version: klasaVersion, Timestamp } = require('klasa');
const { version: discordVersion } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(msg) {
		return msg.sendCode('asciidoc', msg.language.get('COMMAND_STATS',
			(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			Timestamp.toNow(Date.now() - (process.uptime() * 1000), true),
			this.client.users.size.toLocaleString(),
			this.client.guilds.size.toLocaleString(),
			this.client.channels.size.toLocaleString(),
			klasaVersion, discordVersion, process.version
		));
	}

};
