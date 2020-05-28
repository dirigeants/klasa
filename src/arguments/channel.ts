import { Argument, Possible } from 'klasa';

import type { Channel, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: Message): Promise<Channel> {
		// Regular Channel support
		const channelID = Argument.regex.channel.exec(argument);
		const channel = channelID ? await this.client.channels.fetch(channelID[1]).catch(() => null) : null;
		if (channel) return channel;

		// DM Channel support
		const userID = Argument.regex.userOrMember.exec(argument);
		const user = userID ? await this.client.users.fetch(userID[1]).catch(() => null) : null;
		if (user) return user.openDM();
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

}
