const { Command } = require('../../index');
const { version: discordVersion } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const { version: klasaVersion } = require('../../../package.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, 'stats', { description: 'Provides some details about the bot and stats.' });
	}

	async run(msg) {
		const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
		return msg.sendCode('asciidoc', [
			'= STATISTICS =',
			'',
			`• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
			`• Uptime     :: ${duration}`,
			`• Users      :: ${this.client.users.size.toLocaleString()}`,
			`• Servers    :: ${this.client.guilds.size.toLocaleString()}`,
			`• Channels   :: ${this.client.channels.size.toLocaleString()}`,
			`• Klasa     :: v${klasaVersion}`,
			`• Discord.js :: v${discordVersion}`
		]);
	}

};
