import { Argument, Possible } from 'klasa';
import { ChannelType } from '@klasa/dapi-types';

import type { TextChannel, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: Message): Promise<TextChannel> {
		const channelID = Argument.regex.channel.exec(argument);
		const channel = channelID ? await this.client.channels.fetch(channelID[1]).catch(() => null) : null;
		if (channel && channel.type === ChannelType.GuildText) return channel as TextChannel;
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

}
