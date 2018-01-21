const { Command } = require('klasa');
const { User } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: (msg) => msg.language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<User:user|Guild:guild|guild:str> [...]',
			usageDelim: ' ',
			guarded: true
		});
	}

	async run(msg, usersAndGuilds) {
		usersAndGuilds = new Set(usersAndGuilds);
		const usersAdded = [];
		const usersRemoved = [];
		const guildsAdded = [];
		const guildsRemoved = [];

		for (const userOrGuild of usersAndGuilds) {
			const type = userOrGuild instanceof User ? 'user' : 'guild';

			await this.client.configs.update(`${type}Blacklist`, userOrGuild.id || userOrGuild, msg.guild);

			if (type === 'guild' && this.client.configs.guildBlacklist.includes(userOrGuild.id || userOrGuild)) guildsAdded.push(userOrGuild.name || userOrGuild);
			else if (type === 'guild') guildsRemoved.push(userOrGuild.name || userOrGuild);
			else if (type === 'user' && this.client.configs.userBlacklist.includes(userOrGuild.id)) usersAdded.push(userOrGuild.username);
			else usersRemoved.push(userOrGuild.username);
		}

		return msg.sendMessage(msg.language.get('COMMAND_BLACKLIST_SUCCESS', usersAdded, usersRemoved, guildsAdded, guildsRemoved));
	}

};
