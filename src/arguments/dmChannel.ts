import { Argument, Possible, KlasaMessage } from 'klasa';
import type { DMChannel } from '@klasa/core';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: KlasaMessage): Promise<DMChannel> {
		const userID = Argument.regex.userOrMember.exec(argument);
		const user = userID ? await this.client.users.fetch(userID[1]).catch(() => null) : null;
		if (user) return user.openDM();
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

}
