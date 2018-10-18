const { Command } = require('klasa');
const { User } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<User:user|Guild:guild|guild:str> [...]',
			usageDelim: ' ',
			guarded: true
		});
	}

	async run(message, usersAndGuilds) {
		const users = [];
		const guilds = [];

		for (const userOrGuild of new Set(usersAndGuilds)) {
			if (userOrGuild instanceof User) users.push(userOrGuild.id);
			else guilds.push(typeof userOrGuild === 'string' ? userOrGuild : userOrGuild.id);
		}

		const { errors } = await this.client.settings.update([['userBlacklist', users], ['guildBlacklist', guilds]]);
		if (errors.length) throw String(errors[0]);

		const changes = [[], [], [], []];
		for (const user of users) {
			if (this.client.settings.userBlacklist.includes(user)) changes[0].push(user);
			else changes[1].push(user);
		}
		for (const guild of guilds) {
			if (this.client.settings.guildBlacklist.includes(guild)) changes[2].push(guild);
			else changes[3].push(guild);
		}

		return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', changes);
	}

};
