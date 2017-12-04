const { Command, version: klasaVersion } = require('klasa');
const { version: discordVersion } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(msg) {
		return msg.sendCode('asciidoc', [
			msg.language.get('COMMAND_STATS_TITLE'),
			'',
			msg.language.get('COMMAND_STATS_MEM_USAGE', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)),
			msg.language.get('COMMAND_STATS_UPTIME', moment(Date.now() - (process.uptime() * 1000)).toNow(true)),
			msg.language.get('COMMAND_STATS_USERS', this.client.users.size.toLocaleString()),
			msg.language.get('COMMAND_STATS_SERVERS', this.client.guilds.size.toLocaleString()),
			msg.language.get('COMMAND_STATS_CHANNELS', this.client.channels.size.toLocaleString()),
			msg.language.get('COMMAND_STATS_KLASA', klasaVersion),
			msg.language.get('COMMAND_STATS_DISCORDJS', discordVersion),
			msg.language.get('COMMAND_STATS_NODEJS', process.version)
		]);
	}

};
