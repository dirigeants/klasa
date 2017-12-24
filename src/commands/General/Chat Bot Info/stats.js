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
		let users, guilds, channels, memory = 0;

		if (this.client.sharded) {
			const results = await this.client.shard.broadcastEval(`[this.users.size, this.guilds.size, this.channels.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`);
			for (const result of results) {
				users += result[0];
				guilds += result[1];
				channels += result[2];
				memory += result[3];
			}
		}

		return msg.sendCode('asciidoc', msg.language.get('COMMAND_STATS',
			(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			Timestamp.toNow(Date.now() - (process.uptime() * 1000)),
			(users || this.client.users.size).toLocaleString(),
			(guilds || this.client.guilds.size).toLocaleString(),
			(channels || this.client.channels.size).toLocaleString(),
			klasaVersion, discordVersion, process.version, msg
		));
	}

};
