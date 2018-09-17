const { Command } = require('klasa');
const { User } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<User:user|Guild:guild|guild:str> [...]',
			guarded: true
		});
	}

	async run(message, usersAndGuilds) {
		usersAndGuilds = new Set(usersAndGuilds);
		const usersAdded = [];
		const usersRemoved = [];
		const guildsAdded = [];
		const guildsRemoved = [];

		for (const userOrGuild of usersAndGuilds) {
			const type = userOrGuild instanceof User ? 'user' : 'guild';

			await this.client.settings.update(`${type}Blacklist`, userOrGuild.id || userOrGuild, message.guild);

			if (type === 'guild' && this.client.settings.guildBlacklist.includes(userOrGuild.id || userOrGuild)) guildsAdded.push(userOrGuild.name || userOrGuild);
			else if (type === 'guild') guildsRemoved.push(userOrGuild.name || userOrGuild);
			else if (type === 'user' && this.client.settings.userBlacklist.includes(userOrGuild.id)) usersAdded.push(userOrGuild.username);
			else usersRemoved.push(userOrGuild.username);
		}

		return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', [usersAdded, usersRemoved, guildsAdded, guildsRemoved]);
	}

};
