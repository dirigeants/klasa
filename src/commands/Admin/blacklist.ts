import { Command, CommandStore } from 'klasa';
import { User, Message, Guild } from '@klasa/core';

export default class extends Command {

	private terms: string[]

	constructor(store: CommandStore, directory: string, files: readonly string[]) {
		super(store, directory, files, {
			permissionLevel: 10,
			description: language => language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<User:user|Guild:guild|guild:str> [...]',
			usageDelim: ' ',
			guarded: true
		});

		this.terms = ['usersAdded', 'usersRemoved', 'guildsAdded', 'guildsRemoved'];
	}

	public async run(message: Message, usersAndGuilds: [User | Guild | string]): Promise<Message[]> {
		const changes: string[][] = [[], [], [], []];
		const queries: string[][] = [[], []];

		for (const userOrGuild of new Set(usersAndGuilds)) {
			const type = userOrGuild instanceof User ? 'user' : 'guild';
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const blacklist = this.client.settings!.get(`${type}Blacklist`) as string[];

			const id = typeof userOrGuild === 'string' ? userOrGuild : userOrGuild.id;
			const name = userOrGuild instanceof User ? userOrGuild.username : userOrGuild instanceof Guild ? userOrGuild.name : userOrGuild;
			if (blacklist.includes(id)) {
				changes[this.terms.indexOf(`${type}sRemoved`)].push(name);
			} else {
				changes[this.terms.indexOf(`${type}sAdded`)].push(name);
			}
			queries[Number(type === 'guild')].push(id);
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await this.client.settings!.update([['userBlacklist', queries[0]], ['guildBlacklist', queries[1]]]);

		return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', changes);
	}

}
