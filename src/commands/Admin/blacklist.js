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

		this.terms = ['usersAdded', 'usersRemoved', 'guildsAdded', 'guildsRemoved'];
	}

	async run(message, usersAndGuilds) {
		usersAndGuilds = new Set(usersAndGuilds);
		const changes = [[], [], [], []];

		for (const userOrGuild of usersAndGuilds) {
			const type = userOrGuild instanceof User ? 'user' : 'guild';
			await this.client.settings.update(`${type}Blacklist`, userOrGuild.id || userOrGuild, message.guild);

			if (this.client.settings[`${type}Blacklist`].includes(userOrGuild.id || userOrGuild)) changes[this.terms.indexOf(`${type}sAdded`)].push(userOrGuild.name || userOrGuild.username || userOrGuild);
			else changes[this.terms.indexOf(`${type}sRemoved`)].push(userOrGuild.name || userOrGuild.username || userOrGuild);
		}

		return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', changes);
	}

};
