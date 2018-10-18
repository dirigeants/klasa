const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<user|guild> <User:user|Guild:guild|guild:str> [...]',
			usageDelim: ' ',
			guarded: true
		});

		this.terms = ['usersAdded', 'usersRemoved', 'guildsAdded', 'guildsRemoved'];
	}

	async run(message, [type, ...usersAndGuilds]) {
		const blacklistType = `${type}Blacklist`;
		await this.client.settings.update(usersAndGuilds.map(item => [blacklistType, item.id || item]), message.guild);

		const changes = [[], [], [], []];
		for (const userOrGuild of usersAndGuilds) {
			if (this.client.settings[`${type}Blacklist`].includes(userOrGuild.id || userOrGuild)) changes[this.terms.indexOf(`${type}sAdded`)].push(userOrGuild.name || userOrGuild.username || userOrGuild);
			else changes[this.terms.indexOf(`${type}sRemoved`)].push(userOrGuild.name || userOrGuild.username || userOrGuild);
		}

		return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', changes);
	}

};
