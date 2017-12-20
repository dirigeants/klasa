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
		let users = this.client.users.size.toLocaleString();
		let guilds = this.client.guilds.size.toLocaleString();
		let channels = this.client.channels.size.toLocaleString();

		if (this.client.shard) {
			users = (await this.client.shard.fetchClientValues('users.size')).reduce((prev, val) => prev + val, 0).toLocaleString();
			guilds = (await this.client.shard.fetchClientValues('guilds.size')).reduce((prev, val) => prev + val, 0).toLocaleString();
			channels = (await this.client.shard.fetchClientValues('channels.size')).reduce((prev, val) => prev + val, 0).toLocaleString();
		}

		return msg.sendCode('asciidoc', msg.language.get('COMMAND_STATS',
			(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			Timestamp.toNow(Date.now() - (process.uptime() * 1000)),
			users,
			guilds,
			channels,
			klasaVersion, discordVersion, process.version
		));
	}

};
