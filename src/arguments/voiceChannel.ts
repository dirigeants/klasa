import { Argument, Possible } from 'klasa';
import { ChannelType } from '@klasa/dapi-types';

import type { VoiceChannel, Message } from '@klasa/core';

export default class CoreArgument extends Argument {

	public async run(argument: string, possible: Possible, message: Message): Promise<VoiceChannel> {
		const channelID = Argument.regex.channel.exec(argument);
		const channel = channelID ? await this.client.channels.fetch(channelID[1]).catch(() => null) : null;
		if (channel && channel.type === ChannelType.GuildVoice) return channel as VoiceChannel;
		throw message.language.get('RESOLVER_INVALID_CHANNEL', possible.name);
	}

}
