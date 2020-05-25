import { Argument, ArgumentStore, Possible, KlasaMessage } from 'klasa';
import { User } from '@klasa/core';

export default class CoreArgument extends Argument {

	public constructor(store: ArgumentStore, directory: string, file: readonly string[]) {
		super(store, directory, file, { aliases: ['mention'] });
	}

	public async run(argument: string, possible: Possible, message: KlasaMessage): Promise<User> {
		const userID = Argument.regex.userOrMember.exec(argument);
		const user = userID ? await this.client.users.fetch(userID[1]).catch(() => null) : null;
		if (user) return user;
		throw message.language.get('RESOLVER_INVALID_USER', possible.name);
	}

}
