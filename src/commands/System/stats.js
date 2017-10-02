const { Command, version: klasaVersion } = require('klasa');
const { version: discordVersion } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: 'Provides some details about the bot and stats.' });
	}

	async run(msg) {
		return msg.sendCode('asciidoc', [
			'= STATISTICS =',
			'',
			`• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
			`• Uptime     :: ${moment(Date.now() - (process.uptime() * 1000)).toNow(true)}`,
			`• Users      :: ${this.client.users.size.toLocaleString()}`,
			`• Servers    :: ${this.client.guilds.size.toLocaleString()}`,
			`• Channels   :: ${this.client.channels.size.toLocaleString()}`,
			`• Klasa      :: v${klasaVersion}`,
			`• Discord.js :: v${discordVersion}`,
			`• Node.js    :: ${process.version}`
		]);
	}

};
